import { create } from 'zustand';
import api from '../api/api';

interface User {
  id: string;
  username: string;
  email: string;
  xp: number;
  level: number;
  streak: number;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  fetchUser: () => Promise<void>;
  updateUser: (user: User) => void;
}

const mapUser = (u: Record<string, unknown>): User => ({
  id: String(u._id || u.id),
  username: u.username as string,
  email: u.email as string,
  xp: u.xp as number,
  level: u.level as number,
  streak: u.streak as number,
  avatar: u.avatar as string | undefined,
});

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: false,
  fetchUser: async () => {
    set({ loading: true });
    try {
      const response = await api.get('/auth/me');
      set({ user: mapUser(response.data.data), loading: false });
    } catch {
      set({ user: null, loading: false });
    }
  },
  updateUser: (user: User) => {
    set({ user });
  },
}));
