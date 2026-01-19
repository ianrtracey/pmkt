import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PolymarketClient, MarketSchema, MarketsResponseSchema, TagSchema, TagsResponseSchema, CommentSchema, CommentsResponseSchema } from './client.js';
import { mockMarket, mockMarkets, invalidMarketData } from '../test/fixtures/markets.js';
import { mockTag, mockTags, invalidTagData } from '../test/fixtures/tags.js';
import { mockComment, mockComments, invalidCommentData } from '../test/fixtures/comments.js';

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

  describe('getTags', () => {
    it('fetches tags successfully', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => mockTags,
      });

      const result = await client.getTags();

      expect(mockFetch).toHaveBeenCalledTimes(1);
      const calledUrl = mockFetch.mock.calls[0]?.[0] as string;
      expect(calledUrl).toContain('/tags');
      expect(result).toEqual(mockTags);
    });

    it('throws on HTTP error', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        statusText: 'Internal Server Error',
      });

      await expect(client.getTags()).rejects.toThrow('Failed to fetch tags: Internal Server Error');
    });

    it('throws on invalid response data', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => [invalidTagData],
      });

      await expect(client.getTags()).rejects.toThrow();
    });
  });

  describe('getTag', () => {
    it('fetches single tag by slug', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => mockTag,
      });

      const result = await client.getTag('politics');

      expect(mockFetch).toHaveBeenCalledTimes(1);
      const calledUrl = mockFetch.mock.calls[0]?.[0] as string;
      expect(calledUrl).toContain('/tags/politics');
      expect(result).toEqual(mockTag);
    });

    it('throws on not found', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        statusText: 'Not Found',
      });

      await expect(client.getTag('nonexistent')).rejects.toThrow('Failed to fetch tag: Not Found');
    });
  });

  describe('getEventsByTag', () => {
    it('fetches events by tag slug', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => [],
      });

      await client.getEventsByTag('politics');

      expect(mockFetch).toHaveBeenCalledTimes(1);
      const calledUrl = mockFetch.mock.calls[0]?.[0] as string;
      expect(calledUrl).toContain('tag=politics');
    });

    it('passes limit and offset params', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => [],
      });

      await client.getEventsByTag('crypto', { limit: 10, offset: 5 });

      const calledUrl = mockFetch.mock.calls[0]?.[0] as string;
      expect(calledUrl).toContain('tag=crypto');
      expect(calledUrl).toContain('limit=10');
      expect(calledUrl).toContain('offset=5');
    });

    it('throws on HTTP error', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        statusText: 'Bad Request',
      });

      await expect(client.getEventsByTag('invalid')).rejects.toThrow('Failed to fetch events by tag: Bad Request');
    });
  });

  describe('getComments', () => {
    it('fetches comments for an event', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => mockComments,
      });

      const result = await client.getComments({
        entityType: 'Event',
        entityId: 12345,
      });

      expect(mockFetch).toHaveBeenCalledTimes(1);
      const calledUrl = mockFetch.mock.calls[0]?.[0] as string;
      expect(calledUrl).toContain('/comments');
      expect(calledUrl).toContain('parent_entity_type=Event');
      expect(calledUrl).toContain('parent_entity_id=12345');
      expect(result).toEqual(mockComments);
    });

    it('passes pagination params correctly', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => mockComments,
      });

      await client.getComments({
        entityType: 'Event',
        entityId: 12345,
        limit: 50,
        offset: 10,
        ascending: true,
      });

      const calledUrl = mockFetch.mock.calls[0]?.[0] as string;
      expect(calledUrl).toContain('limit=50');
      expect(calledUrl).toContain('offset=10');
      expect(calledUrl).toContain('ascending=true');
    });

    it('uses default limit and offset', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => [],
      });

      await client.getComments({
        entityType: 'market',
        entityId: 'abc123',
      });

      const calledUrl = mockFetch.mock.calls[0]?.[0] as string;
      expect(calledUrl).toContain('limit=25');
      expect(calledUrl).toContain('offset=0');
    });

    it('throws on HTTP error', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        statusText: 'Internal Server Error',
      });

      await expect(
        client.getComments({ entityType: 'Event', entityId: 12345 })
      ).rejects.toThrow('Failed to fetch comments: Internal Server Error');
    });

    it('handles empty results', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => [],
      });

      const result = await client.getComments({
        entityType: 'Event',
        entityId: 99999,
      });

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

describe('TagSchema', () => {
  it('validates correct tag data', () => {
    const result = TagSchema.safeParse(mockTag);
    expect(result.success).toBe(true);
  });

  it('rejects tag without slug', () => {
    const result = TagSchema.safeParse(invalidTagData);
    expect(result.success).toBe(false);
  });

  it('allows extra fields with passthrough', () => {
    const tagWithExtra = {
      ...mockTag,
      extraField: 'some value',
    };
    const result = TagSchema.safeParse(tagWithExtra);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toHaveProperty('extraField', 'some value');
    }
  });

  it('allows minimal tag with only slug', () => {
    const minimalTag = { slug: 'minimal' };
    const result = TagSchema.safeParse(minimalTag);
    expect(result.success).toBe(true);
  });
});

describe('TagsResponseSchema', () => {
  it('validates array of tags', () => {
    const result = TagsResponseSchema.safeParse(mockTags);
    expect(result.success).toBe(true);
  });

  it('validates empty array', () => {
    const result = TagsResponseSchema.safeParse([]);
    expect(result.success).toBe(true);
  });

  it('rejects non-array', () => {
    const result = TagsResponseSchema.safeParse(mockTag);
    expect(result.success).toBe(false);
  });
});

describe('CommentSchema', () => {
  it('validates correct comment data', () => {
    const result = CommentSchema.safeParse(mockComment);
    expect(result.success).toBe(true);
  });

  it('rejects comment without id', () => {
    const result = CommentSchema.safeParse(invalidCommentData);
    expect(result.success).toBe(false);
  });

  it('allows extra fields with passthrough', () => {
    const commentWithExtra = {
      ...mockComment,
      extraField: 'some value',
    };
    const result = CommentSchema.safeParse(commentWithExtra);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toHaveProperty('extraField', 'some value');
    }
  });

  it('allows comment with null profile', () => {
    const commentNullProfile = {
      id: 'test-123',
      body: 'Test comment',
      profile: null,
    };
    const result = CommentSchema.safeParse(commentNullProfile);
    expect(result.success).toBe(true);
  });

  it('allows minimal comment with only id', () => {
    const minimalComment = { id: 'minimal-123' };
    const result = CommentSchema.safeParse(minimalComment);
    expect(result.success).toBe(true);
  });
});

describe('CommentsResponseSchema', () => {
  it('validates array of comments', () => {
    const result = CommentsResponseSchema.safeParse(mockComments);
    expect(result.success).toBe(true);
  });

  it('validates empty array', () => {
    const result = CommentsResponseSchema.safeParse([]);
    expect(result.success).toBe(true);
  });

  it('rejects non-array', () => {
    const result = CommentsResponseSchema.safeParse(mockComment);
    expect(result.success).toBe(false);
  });
});
