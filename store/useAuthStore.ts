import { create } from 'zustand';

interface AuthState {
    isLoading: boolean;
    setIsLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    isLoading: true,
    setIsLoading: (isLoading) => set({ isLoading }),
}));
