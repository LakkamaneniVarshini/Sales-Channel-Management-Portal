import { describe, it, expect } from 'vitest';
import { handleApiResponse } from '@/lib/api/client';
import type { ApiResponse } from '@/lib/types/api.types';
import type { AxiosResponse } from 'axios';

function createResponse<T>(data: ApiResponse<T>): AxiosResponse<ApiResponse<T>> {
  return {
    data,
    status: 200,
    statusText: 'OK',
    headers: {},
    config: {} as AxiosResponse['config'],
  };
}

describe('API response transformation', () => {
  it('returns data for successful responses', () => {
    const response = createResponse({
      status: 'success',
      message: 'OK',
      data: { id: '1', name: 'Demo' },
    });

    expect(handleApiResponse(response)).toEqual({ id: '1', name: 'Demo' });
  });

  it('throws for error responses', () => {
    const response = createResponse({
      status: 'error',
      message: 'Request failed',
    });

    expect(() => handleApiResponse(response)).toThrow('Request failed');
  });
});
