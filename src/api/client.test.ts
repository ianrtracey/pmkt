import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PolymarketClient, MarketSchema, MarketsResponseSchema } from './client.js';
import { mockMarket, mockMarkets, invalidMarketData } from '../test/fixtures/markets.js';

describe('PolymarketClient', () => {
  let client: PolymarketClient;
  let mockFetch: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    client = new PolymarketClient();
    mockFetch = vi.fn();
    vi.stubGlobal('fetch', mockFetch);
  });

  describe('getMarkets', () => {
    it('fetches markets successfully', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => mockMarkets,
      });

      const result = await client.getMarkets();

      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockMarkets);
    });

    it('passes query params correctly', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => mockMarkets,
      });

      await client.getMarkets({ limit: 10, offset: 5, active: true });

      const calledUrl = mockFetch.mock.calls[0]?.[0] as string;
      expect(calledUrl).toContain('limit=10');
      expect(calledUrl).toContain('offset=5');
      expect(calledUrl).toContain('active=true');
    });

    it('throws on HTTP error', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        statusText: 'Internal Server Error',
      });

      await expect(client.getMarkets()).rejects.toThrow('Failed to fetch markets: Internal Server Error');
    });

    it('throws on invalid response data', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => [invalidMarketData],
      });

      await expect(client.getMarkets()).rejects.toThrow();
    });
  });

  describe('getMarket', () => {
    it('fetches single market successfully', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => mockMarket,
      });

      const result = await client.getMarket('12345');

      expect(mockFetch).toHaveBeenCalledTimes(1);
      const calledUrl = mockFetch.mock.calls[0]?.[0] as string;
      expect(calledUrl).toContain('/markets/12345');
      expect(result).toEqual(mockMarket);
    });

    it('throws on not found', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        statusText: 'Not Found',
      });

      await expect(client.getMarket('nonexistent')).rejects.toThrow('Failed to fetch market: Not Found');
    });
  });

  describe('searchMarkets', () => {
    it('searches markets correctly', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => mockMarkets,
      });

      const result = await client.searchMarkets('bitcoin');

      expect(mockFetch).toHaveBeenCalledTimes(1);
      const calledUrl = mockFetch.mock.calls[0]?.[0] as string;
      expect(calledUrl).toContain('_q=bitcoin');
      expect(result).toEqual(mockMarkets);
    });

    it('handles empty results', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => [],
      });

      const result = await client.searchMarkets('nonexistent query');

      expect(result).toEqual([]);
    });
  });
});

describe('MarketSchema', () => {
  it('validates correct market data', () => {
    const result = MarketSchema.safeParse(mockMarket);
    expect(result.success).toBe(true);
  });

  it('rejects invalid data', () => {
    const result = MarketSchema.safeParse(invalidMarketData);
    expect(result.success).toBe(false);
  });

  it('allows extra fields with passthrough', () => {
    const marketWithExtra = {
      ...mockMarket,
      extraField: 'some value',
      anotherExtra: 123,
    };
    const result = MarketSchema.safeParse(marketWithExtra);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toHaveProperty('extraField', 'some value');
    }
  });
});

describe('MarketsResponseSchema', () => {
  it('validates array of markets', () => {
    const result = MarketsResponseSchema.safeParse(mockMarkets);
    expect(result.success).toBe(true);
  });

  it('validates empty array', () => {
    const result = MarketsResponseSchema.safeParse([]);
    expect(result.success).toBe(true);
  });

  it('rejects non-array', () => {
    const result = MarketsResponseSchema.safeParse(mockMarket);
    expect(result.success).toBe(false);
  });
});
