import { create } from "zustand";
import type { Event } from "../api/index.js";

interface AppState {
  events: Event[];
  selectedEvent: Event | null;
  isLoading: boolean;
  error: string | null;
  view: "events" | "markets" | "portfolio" | "search";

  setEvents: (events: Event[]) => void;
  selectEvent: (event: Event | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setView: (view: AppState["view"]) => void;
}

export const useAppStore = create<AppState>((set) => ({
  events: [],
  selectedEvent: null,
  isLoading: false,
  error: null,
  view: "events",

  setEvents: (events) => set({ events }),
  selectEvent: (event) => set({ selectedEvent: event }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  setView: (view) => set({ view }),
}));
