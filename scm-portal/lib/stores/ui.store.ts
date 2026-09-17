import { create } from 'zustand';

interface UIState {
  // Modal states
  isOtpModalOpen: boolean;
  otpModalData: {
    msisdn: string;
    operation: string;
    onVerified: () => void;
    onError: (error: string) => void;
  } | null;

  // Loading states
  isLoading: boolean;
  loadingMessage: string;

  // Error states
  error: string | null;

  // Actions
  setOtpModalOpen: (isOpen: boolean, data?: UIState['otpModalData']) => void;
  setLoading: (isLoading: boolean, message?: string) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  // Initial states
  isOtpModalOpen: false,
  otpModalData: null,
  isLoading: false,
  loadingMessage: '',
  error: null,

  // Actions
  setOtpModalOpen: (isOpen, data) =>
    set({
      isOtpModalOpen: isOpen,
      otpModalData: data || null,
    }),
  setLoading: (isLoading, message = '') =>
    set({
      isLoading,
      loadingMessage: message,
    }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
}));