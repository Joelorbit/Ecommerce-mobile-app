import { create } from 'zustand';
import { Session, User } from '@supabase/supabase-js';

interface AuthState {
  session: Session | null;
  user: User | null;
  role: 'user' | 'admin' | null;
  initialized: boolean;
  setSession: (session: Session | null) => void;
  clearSession: () => void;
  setInitialized: (initialized: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  user: null,
  role: null,
  initialized: false,
  setSession: (session) => {
    const user = session?.user || null;
    // Extract role from user metadata if present (set via trigger in SQL)
    const role = (user?.user_metadata?.role as any) || (user ? 'user' : null);
    set({ session, user, role });
  },
  clearSession: () => set({ session: null, user: null, role: null }),
  setInitialized: (initialized) => set({ initialized }),
}));
