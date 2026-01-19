import { create } from "zustand";
import type { Market } from "../api/index.js";

interface AppState {
  markets: Market[];
  selectedMarketId: string | null;
  isLoading: boolean;
  error: string | null;
  view: "markets" | "portfolio" | "search";

  setMarkets: (markets: Market[]) => void;
  selectMarket: (id: string | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setView: (view: AppState["view"]) => void;
}

export const useAppStore = create<AppState>((set) => ({
  markets: [],
  selectedMarketId: null,
  isLoading: false,
  error: null,
  view: "markets",

  setMarkets: (markets) => set({ markets }),
  selectMarket: (id) => set({ selectedMarketId: id }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  setView: (view) => set({ view }),
}));
