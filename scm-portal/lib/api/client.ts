import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// API response structure
export interface ApiResponse<T = any> {
  status: 'success' | 'error';
  message: string;
  data?: T;
}

// API error structure
export interface ApiError {
  message: string;
  status?: number;
  code?: string;
  details?: any;
}

// Create axios instance
const createApiClient = (): AxiosInstance => {
  const client = axios.create({
    baseURL: process.env.NEXT_PUBLIC_USER_API_URL || 'https://ui.example.com',
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request interceptor
  client.interceptors.request.use(
    (config) => {
      // Add auth token if available
      const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      // Add request logging in development
      if (process.env.NODE_ENV === 'development') {
        console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, config.data);
      }

      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor
  client.interceptors.response.use(
    (response: AxiosResponse) => {
      // Add response logging in development
      if (process.env.NODE_ENV === 'development') {
        console.log(`[API Response] ${response.config.method?.toUpperCase()} ${response.config.url}`, response.data);
      }

      return response;
    },
    (error: AxiosError) => {
      // Handle error responses
      const apiError: ApiError = {
        message: error.message || 'An error occurred',
        status: error.response?.status,
        code: error.code,
      };

      // Extract error details from response if available
      if (error.response?.data) {
        const responseData = error.response.data as any;
        apiError.message = responseData.message || apiError.message;
        apiError.details = responseData;
      }

      // Handle specific error cases
      if (error.response?.status === 401) {
        // Unauthorized - clear token and redirect to login
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth_token');
          window.location.href = '/login';
        }
      }

      if (process.env.NODE_ENV === 'development') {
        console.error('[API Error]', apiError);
      }

      return Promise.reject(apiError);
    }
  );

  return client;
};

// Create API clients for different domains
export const apiClient = createApiClient();

export const userApiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_USER_API_URL || 'https://ui.example.com/scm-user-api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const dbApiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_DB_API_URL || 'https://ui.example.com/scm-db-api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const plansApiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_PLANS_API_URL || 'https://ui.example.com/scm-plans-api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const dealerApiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_DEALER_API_URL || 'https://ui.example.com/scm-dealer-api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const franchiseApiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_FRANCHISE_API_URL || 'https://ui.example.com/scmfmis-reports-api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const stockApiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_STOCK_API_URL || 'https://ui.example.com/scm-stock-api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Apply interceptors to all clients
[userApiClient, dbApiClient, plansApiClient, dealerApiClient, franchiseApiClient, stockApiClient].forEach(client => {
  client.interceptors.request.use(
    (config) => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  client.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      const apiError: ApiError = {
        message: error.message || 'An error occurred',
        status: error.response?.status,
      };

      if (error.response?.data) {
        const responseData = error.response.data as any;
        apiError.message = responseData.message || apiError.message;
        apiError.details = responseData;
      }

      if (error.response?.status === 401) {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth_token');
          window.location.href = '/login';
        }
      }

      return Promise.reject(apiError);
    }
  );
});

// Helper function to handle API responses
export const handleApiResponse = <T>(response: AxiosResponse<ApiResponse<T>>): T => {
  if (response.data.status === 'error') {
    throw new Error(response.data.message || 'API request failed');
  }
  return response.data.data as T;
};

// Helper function to handle API errors
export const handleApiError = (error: any): never => {
  if (error.response?.data) {
    throw new Error(error.response.data.message || 'API request failed');
  }
  throw error;
};