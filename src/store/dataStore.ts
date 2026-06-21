import { create } from "zustand";
import type { DiscordUser, AnalyticsData, ParseProgress } from "@/types/discord";

interface DataStore {
  user: DiscordUser | null;
  analytics: AnalyticsData | null;
  progress: ParseProgress | null;
  isLoading: boolean;
  error: string | null;
  isParsed: boolean;

  setUser: (user: DiscordUser | null) => void;
  setAnalytics: (analytics: AnalyticsData | null) => void;
  setProgress: (progress: ParseProgress | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  setIsParsed: (isParsed: boolean) => void;
  reset: () => void;
}

export const useDataStore = create<DataStore>((set) => ({
  user: null,
  analytics: null,
  progress: null,
  isLoading: false,
  error: null,
  isParsed: false,

  setUser: (user) => set({ user }),
  setAnalytics: (analytics) => set({ analytics }),
  setProgress: (progress) => set({ progress }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  setIsParsed: (isParsed) => set({ isParsed }),
  reset: () =>
    set({
      user: null,
      analytics: null,
      progress: null,
      isLoading: false,
      error: null,
      isParsed: false,
    }),
}));
