import 'react-native-url-polyfill/auto';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xtlzdnxtnoepjmldsvty.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh0bHpkbnh0bm9lcGptbGRzdnR5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcxOTI1NDAsImV4cCI6MjA5Mjc2ODU0MH0.mNaHERIiX158yf5Ru0GuPLUNFi5_9TNtE7YPdrGckIs';

// Validate URL format
const isValidUrl = supabaseUrl.startsWith('http://') || supabaseUrl.startsWith('https://');

// Custom storage for web to avoid SSR issues with AsyncStorage
// AsyncStorage on web tries to access 'window' which isn't available during static rendering
const isWeb = Platform.OS === 'web';
const storage = isWeb 
  ? {
      getItem: (key: string) => {
        if (typeof window === 'undefined') return null;
        return window.localStorage.getItem(key);
      },
      setItem: (key: string, value: string) => {
        if (typeof window === 'undefined') return;
        window.localStorage.setItem(key, value);
      },
      removeItem: (key: string) => {
        if (typeof window === 'undefined') return;
        window.localStorage.removeItem(key);
      },
    }
  : AsyncStorage;

if (!isValidUrl) {
  console.warn('⚠️ Invalid or missing EXPO_PUBLIC_SUPABASE_URL. Supabase features will not work.');
}

export const supabase = isValidUrl 
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        storage: storage as any,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      },
    })
  : (null as any);

