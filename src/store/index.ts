import { create } from "zustand";
import type { Event } from "../api/index.js";

interface AppState {
  events: Event[];
  selectedEventId: string | null;
  isLoading: boolean;
  error: string | null;
  view: "events" | "portfolio" | "search";

  setEvents: (events: Event[]) => void;
  selectEvent: (id: string | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setView: (view: AppState["view"]) => void;
}

export const useAppStore = create<AppState>((set) => ({
  events: [],
  selectedEventId: null,
  isLoading: false,
  error: null,
  view: "events",

  setEvents: (events) => set({ events }),
  selectEvent: (id) => set({ selectedEventId: id }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  setView: (view) => set({ view }),
}));
