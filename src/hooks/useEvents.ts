import { useEffect, useCallback } from "react";
import { useAppStore } from "../store/index.js";
import { polymarketClient } from "../api/index.js";

export function useEvents() {
  const { events, isLoading, error, setEvents, setLoading, setError } =
    useAppStore();

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await polymarketClient.getEvents({
        limit: 25,
        active: true,
        closed: false,
        ascending: false,
      });
      setEvents(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch events");
    } finally {
      setLoading(false);
    }
  }, [setEvents, setLoading, setError]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return {
    events,
    isLoading,
    error,
    refresh: fetchEvents,
  };
}
