// User store for user state management
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { User, UserPreferences } from '../types';
import { updateUserPreferences } from '../lib/auth';

interface UserState {
  user: User | null;
  loading: boolean;
  preferences: UserPreferences | null;
}

interface UserActions {
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  updatePreferences: (preferences: Partial<UserPreferences>) => Promise<void>;
  clearUser: () => void;
}

type UserStore = UserState & UserActions;

export const useUserStore = create<UserStore>()(
  devtools(
    persist(
      (set, get) => ({
        // State
        user: null,
        loading: true,
        preferences: null,

        // Actions
        setUser: (user) => {
          set({ 
            user, 
            preferences: user?.preferences || null,
            loading: false 
          });
        },

        setLoading: (loading) => {
          set({ loading });
        },

        updatePreferences: async (newPreferences) => {
          const { user } = get();
          if (!user) return;

          try {
            const updatedPreferences = {
              ...user.preferences,
              ...newPreferences
            };

            // Update in Firestore
            await updateUserPreferences(user.uid, updatedPreferences);

            // Update local state
            set({
              user: {
                ...user,
                preferences: updatedPreferences
              },
              preferences: updatedPreferences
            });
          } catch (error) {
            console.error('Error updating preferences:', error);
            throw error;
          }
        },

        clearUser: () => {
          set({ 
            user: null, 
            preferences: null, 
            loading: false 
          });
        }
      }),
      {
        name: 'user-storage',
        partialize: (state) => ({ 
          user: state.user, 
          preferences: state.preferences 
        })
      }
    ),
    { name: 'user-store' }
  )
);