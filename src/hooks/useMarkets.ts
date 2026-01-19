import { useEffect, useCallback } from "react";
import { useAppStore } from "../store/index.js";
import { polymarketClient } from "../api/index.js";

export function useMarkets() {
  const { markets, isLoading, error, setMarkets, setLoading, setError } =
    useAppStore();

  const fetchMarkets = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await polymarketClient.getMarkets({
        limit: 50,
        active: true,
      });
      setMarkets(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch markets");
    } finally {
      setLoading(false);
    }
  }, [setMarkets, setLoading, setError]);

  useEffect(() => {
    fetchMarkets();
  }, [fetchMarkets]);

  return {
    markets,
    isLoading,
    error,
    refresh: fetchMarkets,
  };
}
