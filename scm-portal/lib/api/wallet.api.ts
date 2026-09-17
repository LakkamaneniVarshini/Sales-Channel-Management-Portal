import { stockApiClient } from './client';
import type { ApiResponse, WalletAdjustmentRequest } from '../types/api.types';

// Wallet Operations
export const walletAdjustment = async (request: WalletAdjustmentRequest): Promise<any> => {
  const response = await stockApiClient.post<ApiResponse<any>>(
    '/stock-api/walletAdjustment',
    request
  );
  if (response.data.status === 'error') {
    throw new Error(response.data.message || 'Wallet adjustment failed');
  }
  return response.data.data;
};