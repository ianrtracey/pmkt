import { describe, it, expect } from 'vitest';
import { PolymarketClient, MarketSchema, MarketsResponseSchema } from './client.js';

describe('PolymarketClient Integration Tests', () => {
  const client = new PolymarketClient();

  describe('getMarkets', () => {
    it('fetches real markets from the API', async () => {
      const markets = await client.getMarkets({ limit: 5 });

      expect(Array.isArray(markets)).toBe(true);
      expect(markets.length).toBeGreaterThan(0);
      expect(markets.length).toBeLessThanOrEqual(5);

      // Validate each market against the schema
      for (const market of markets) {
        const result = MarketSchema.safeParse(market);
        expect(result.success).toBe(true);
      }
    });

    it('respects limit and offset pagination', async () => {
      const firstPage = await client.getMarkets({ limit: 3, offset: 0 });
      const secondPage = await client.getMarkets({ limit: 3, offset: 3 });

      expect(firstPage.length).toBeLessThanOrEqual(3);
      expect(secondPage.length).toBeLessThanOrEqual(3);

      // Ensure pages are different (assuming enough markets exist)
      if (firstPage.length > 0 && secondPage.length > 0) {
        const firstIds = firstPage.map((m) => m.id);
        const secondIds = secondPage.map((m) => m.id);
        const overlap = firstIds.filter((id) => secondIds.includes(id));
        expect(overlap.length).toBe(0);
      }
    });

    it('filters active markets', async () => {
      const activeMarkets = await client.getMarkets({ limit: 10, active: true });

      // All returned markets should be active
      for (const market of activeMarkets) {
        expect(market.active).toBe(true);
      }
    });
  });

  describe('getMarket', () => {
    it('fetches a single market by ID', async () => {
      // First get a list of markets to get a valid ID
      const markets = await client.getMarkets({ limit: 1 });
      expect(markets.length).toBeGreaterThan(0);

      const marketId = markets[0]!.id;
      const market = await client.getMarket(marketId);

      expect(market.id).toBe(marketId);
      const result = MarketSchema.safeParse(market);
      expect(result.success).toBe(true);
    });
  });

  describe('searchMarkets', () => {
    it('searches markets by query', async () => {
      const markets = await client.searchMarkets('president');

      expect(Array.isArray(markets)).toBe(true);
      // The response should validate against the schema
      const result = MarketsResponseSchema.safeParse(markets);
      expect(result.success).toBe(true);
    });

    it('returns empty array for no matches', async () => {
      // Use a very unlikely search term
      const markets = await client.searchMarkets('xyznonexistentquery12345');

      expect(Array.isArray(markets)).toBe(true);
    });
  });
});
