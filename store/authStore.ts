import { create } from 'zustand';
import { User } from '../types/models';
import { mockApi } from '../services/mockApi';

interface AuthState {
    user: User | null;
    loading: boolean;
    error: string | null;

    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string, fullName: string) => Promise<void>;
    logout: () => void;
    fetchCurrentUser: () => Promise<void>;
    resetPassword: (email: string) => Promise<void>;
    verifyEmail: (code: string) => Promise<void>;
    reset: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    loading: false,
    error: null,

    login: async (email, password) => {
        set({ loading: true, error: null });
        try {
            const user = await mockApi.login(email, password);
            set({ user, loading: false });
        } catch (error) {
            set({ error: 'Login failed', loading: false });
            throw error;
        }
    },

    register: async (email, password, fullName) => {
        set({ loading: true, error: null });
        try {
            // Simulate registration API call
            await new Promise((resolve) => setTimeout(resolve, 1000));
            // In a real app, this would create a user account
            set({ loading: false });
        } catch (error) {
            set({ error: 'Registration failed', loading: false });
            throw error;
        }
    },

    logout: () => {
        set({ user: null });
    },

    fetchCurrentUser: async () => {
        set({ loading: true });
        try {
            const user = await mockApi.getCurrentUser();
            set({ user, loading: false });
        } catch (error) {
            set({ error: 'Failed to fetch user', loading: false });
        }
    },

    resetPassword: async (email) => {
        set({ loading: true, error: null });
        try {
            // Simulate password reset API call
            await new Promise((resolve) => setTimeout(resolve, 1000));
            set({ loading: false });
        } catch (error) {
            set({ error: 'Password reset failed', loading: false });
            throw error;
        }
    },

    verifyEmail: async (code) => {
        set({ loading: true, error: null });
        try {
            // Simulate email verification API call
            await new Promise((resolve) => setTimeout(resolve, 1000));
            set({ loading: false });
        } catch (error) {
            set({ error: 'Email verification failed', loading: false });
            throw error;
        }
    },

    reset: () => {
        set({ user: null, loading: false, error: null });
    },
}));
