import { userApiClient, dbApiClient } from './client';
import { isMockApiEnabled } from '@/lib/utils/mock-api';
import type {
  ApiResponse,
  User,
  CreateUserRequest,
  ChangePasswordRequest,
  UserPermissions,
  SendOtpRequest,
  ValidateOtpRequest,
  OtpResponse,
  Circle,
} from '../types/api.types';

// User Authentication
// Note: The Postman collection doesn't include a login endpoint
// Authentication might be handled differently - possibly session-based or through a separate auth service
// For now, this is a placeholder that should be replaced with the actual authentication mechanism
export const login = async (username: string, password: string): Promise<any> => {
  // This endpoint doesn't exist in the Postman collection
  // The actual authentication mechanism needs to be confirmed with the backend team
  // For development, we'll return mock data
  return {
    user: {
      userId: '456',
      hrmsId: '123456',
      username: username,
      mobileNumber: '98XXXXXXXX',
      firstName: 'Demo',
      lastName: 'User',
      address: 'Demo Address',
      dob: '1988-01-01',
      roleId: 3,
      zoneId: 1,
      circleId: 1,
      ssaId: 1,
      status: 1,
    },
    token: 'mock_token',
  };
};

export const logout = async (username: string): Promise<any> => {
  const response = await userApiClient.get<ApiResponse<any>>(
    `/scm-user-api/scmlogout?username=${username}`
  );
  return response.data.data;
};

// User Operations
export const createUser = async (request: CreateUserRequest): Promise<User> => {
  if (isMockApiEnabled()) {
    return {
      userId: request.userId,
      hrmsId: request.hrmsId,
      username: request.username,
      mobileNumber: request.mobileNumber,
      firstName: request.firstName,
      lastName: request.lastName,
      address: request.address,
      dob: request.dob,
      roleId: request.roleId,
      zoneId: request.zoneId,
      circleId: request.circleId,
      ssaId: request.ssaId,
      status: request.status,
      cdt: request.cdt,
      mdt: request.mdt,
    };
  }
  const response = await userApiClient.post<ApiResponse<User>>(
    '/scm-user-api/usercreation',
    request
  );
  if (response.data.status === 'error') {
    throw new Error(response.data.message || 'User creation failed');
  }
  return response.data.data as User;
};

export const getUser = async (username: string): Promise<User> => {
  const response = await userApiClient.get<ApiResponse<User>>(
    `/scm-user-api/getUser/${username}`
  );
  if (response.data.status === 'error') {
    throw new Error(response.data.message || 'Failed to fetch user');
  }
  return response.data.data as User;
};

export const listUsers = async (): Promise<User[]> => {
  // This endpoint doesn't exist in the Postman collection
  // For now, return mock data - this should be replaced with a real API endpoint
  return [
    {
      userId: '1',
      hrmsId: '123456',
      username: 'admin',
      mobileNumber: '9876543210',
      firstName: 'Admin',
      lastName: 'User',
      address: 'Admin Address',
      status: 1,
      cdt: '2024-01-01',
      mdt: '2024-01-01',
      roleId: 1,
      passwordChangeDate: '2024-01-01',
      ssaId: 1,
      circleId: 1,
      dob: '1990-01-01',
      ipAddress: '192.168.1.1',
      expiredate: '2025-01-01',
      userIpAddress: '192.168.1.1',
      loginStatus: '1',
      zoneId: 1,
      roleName: 'Administrator',
      permissions: {
        roleId: 1,
        username: 'admin',
        hrmsId: '123456',
        dealerPermissions: 1,
        walletPermissions: 1,
        userPermissions: 1,
        commissionPermissions: 1,
        plansNumberpermissions: 1,
        reportsPermissions: 1,
        stockCheck: 1,
        dealerMpinReset: 1,
        franchiseAddBalance: 1,
        bulkRecharge: 1,
        varepReports: 1,
        userActivityReports: 1,
        dealerStatus: 1,
        transactionStatus: 1,
        topupReversal: 1,
        simSaleUpload: 1,
        simInventory: 1,
        pendingClearence: 1,
        inReconsilation: 1,
        mobileApp: 1,
        deferredCommission: 1,
        cbp: 1,
        simUpgrade: 1,
        mnp: 1,
        frcStv: 1,
        bulk_purge: 1,
        e_auction: 1,
        denominations: 1,
        prepaidCommissions: 1,
        postpaidCommissions: 1,
        landlineCommissions: 1,
        FOSCreation: 1,
      },
    },
  ];
};

export const getUserWithHrmsId = async (
  hrmsId: string,
  username: string,
  guiUsername: string
): Promise<User> => {
  const response = await userApiClient.get<ApiResponse<User>>(
    `/scm-user-api/getUserwithHrmsIdandUsername?hrmsId=${hrmsId}&username=${username}&guiUsername=${guiUsername}`
  );
  if (response.data.status === 'error') {
    throw new Error(response.data.message || 'Failed to fetch user');
  }
  return response.data.data as User;
};

export const modifyUser = async (username: string, hrmsId: string): Promise<User> => {
  const response = await userApiClient.post<ApiResponse<User>>('/scm-user-api/modifyUser', {
    username,
    hrmsId,
  });
  if (response.data.status === 'error') {
    throw new Error(response.data.message || 'Failed to modify user');
  }
  return response.data.data as User;
};

export const fetchUsername = async (username: string): Promise<any> => {
  const response = await userApiClient.get<ApiResponse<any>>(
    `/scm-user-api/fetchusername?username=${username}`
  );
  if (response.data.status === 'error') {
    throw new Error(response.data.message || 'Failed to fetch username');
  }
  return response.data.data;
};

// Permission Operations
export const getUserPermissions = async (
  hrmsId: string,
  username: string,
  guiUsername: string
): Promise<UserPermissions> => {
  const response = await userApiClient.get<ApiResponse<UserPermissions>>(
    `/scm-user-api/getUserPermissionwithHrmsIdandUsername?hrmsId=${hrmsId}&username=${username}&guiUsername=${guiUsername}`
  );
  return response.data.data as UserPermissions;
};

export const modifyPermissions = async (guiUser: string, username: string): Promise<any> => {
  const response = await userApiClient.post<ApiResponse<any>>(
    `/scm-user-api/modifyPermissions?guiUser=${guiUser}`,
    { username }
  );
  return response.data.data;
};

// Status Operations
export const userStatusCheck = async (username: string): Promise<any> => {
  const response = await userApiClient.get<ApiResponse<any>>(
    `/scm-user-api/userStatusCheck?username=${username}`
  );
  return response.data.data;
};

export const changeUserStatus = async (
  hrmsId: string,
  username: string,
  guiUsername: string,
  status: number
): Promise<any> => {
  const response = await userApiClient.post<ApiResponse<any>>(
    `/scm-user-api/userStatusChangewithHrmsIdandUsername?hrmsId=${hrmsId}&username=${username}&guiUsername=${guiUsername}&status=${status}`
  );
  return response.data.data;
};

// Password Operations
export const changePassword = async (request: ChangePasswordRequest): Promise<any> => {
  const response = await userApiClient.post<ApiResponse<any>>(
    '/scm-user-api/changePassword',
    request
  );
  return response.data.data;
};

// Circle Info
export const getCirclesInfo = async (hrmsId: string): Promise<Circle[]> => {
  const response = await userApiClient.get<ApiResponse<Circle[]>>(
    `/scm-user-api/getCirclesInfo?hrmsId=${hrmsId}`
  );
  return response.data.data || [];
};

// OTP Operations for User Management
export const sendUserCreationOtp = async (msisdn: string): Promise<OtpResponse> => {
  const { sendOtp } = await import('./masterdata.api');
  return sendOtp({ msisdn, operation: '10069', topic: 'UserCreation' });
};

export const sendModifyUserOtp = async (msisdn: string): Promise<any> => {
  const request: SendOtpRequest = {
    msisdn,
    operation: '10069',
    topic: 'Modifyuseredit',
  };
  const response = await dbApiClient.post<ApiResponse<any>>(
    '/masterdata-db-api/sendOtp',
    request
  );
  return response.data.data;
};

export const sendModifyPermissionOtp = async (msisdn: string): Promise<any> => {
  const request: SendOtpRequest = {
    msisdn,
    operation: '10069',
    topic: 'Modifyuserpermission',
  };
  const response = await dbApiClient.post<ApiResponse<any>>(
    '/masterdata-db-api/sendOtp',
    request
  );
  return response.data.data;
};

export const sendModifyStatusOtp = async (msisdn: string): Promise<any> => {
  const request: SendOtpRequest = {
    msisdn,
    operation: '10069',
    topic: 'Modifyuserstatus',
  };
  const response = await dbApiClient.post<ApiResponse<any>>(
    '/masterdata-db-api/sendOtp',
    request
  );
  return response.data.data;
};

export const sendChangePasswordOtp = async (msisdn: string): Promise<any> => {
  const request: SendOtpRequest = {
    msisdn,
    operation: '10069',
    topic: 'ChangePassword',
  };
  const response = await dbApiClient.post<ApiResponse<any>>(
    '/masterdata-db-api/sendOtp',
    request
  );
  return response.data.data;
};