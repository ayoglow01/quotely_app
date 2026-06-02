import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { nanoid } from 'nanoid';
import type { User } from '../types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  registeredUsers: Array<{ email: string; password: string; userId: string; name: string }>;

  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      registeredUsers: [],

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        await new Promise((r) => setTimeout(r, 600));

        const { registeredUsers } = get();
        const found = registeredUsers.find(
          (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
        );

        if (!found) {
          set({ isLoading: false, error: 'Invalid email or password.' });
          return false;
        }

        const user: User = {
          id: found.userId,
          name: found.name,
          email: found.email,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          preferences: {
            theme: 'light',
            quotesPerPage: 20,
          },
        };

        set({ user, isAuthenticated: true, isLoading: false, error: null });
        return true;
      },

      signup: async (name: string, email: string, password: string) => {
        set({ isLoading: true, error: null });
        await new Promise((r) => setTimeout(r, 600));

        const { registeredUsers } = get();
        const exists = registeredUsers.find(
          (u) => u.email.toLowerCase() === email.toLowerCase()
        );

        if (exists) {
          set({ isLoading: false, error: 'An account with this email already exists.' });
          return false;
        }

        const userId = nanoid();
        const newUser = { email, password, userId, name };

        const user: User = {
          id: userId,
          name,
          email,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          preferences: {
            theme: 'light',
            quotesPerPage: 20,
          },
        };

        set({
          registeredUsers: [...registeredUsers, newUser],
          user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
        return true;
      },

      logout: () => {
        set({ user: null, isAuthenticated: false, error: null });
      },

      updateProfile: (updates) => {
        const { user } = get();
        if (!user) return;
        set({
          user: { ...user, ...updates, updatedAt: new Date().toISOString() },
        });
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'quotely-auth',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        registeredUsers: state.registeredUsers,
      }),
    }
  )
);
