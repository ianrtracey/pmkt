import { z } from "zod";

const POLYMARKET_API_BASE = "https://clob.polymarket.com";
const GAMMA_API_BASE = "https://gamma-api.polymarket.com";

// Helper to parse JSON string or pass through array
const jsonStringArray = z.preprocess((val) => {
  if (typeof val === "string") {
    try {
      return JSON.parse(val);
    } catch {
      return val;
    }
  }
  return val;
}, z.array(z.string()));

export const MarketSchema = z.object({
  id: z.string(),
  question: z.string(),
  conditionId: z.string(),
  slug: z.string(),
  endDate: z.string().optional(),
  liquidity: z.string(),
  volume: z.string(),
  volume24hr: z.number().optional(),
  outcomes: jsonStringArray,
  outcomePrices: jsonStringArray,
  active: z.boolean(),
}).passthrough();

export type Market = z.infer<typeof MarketSchema>;

export const MarketsResponseSchema = z.array(MarketSchema);

export class PolymarketClient {
  private baseUrl: string;
  private gammaUrl: string;

  constructor() {
    this.baseUrl = POLYMARKET_API_BASE;
    this.gammaUrl = GAMMA_API_BASE;
  }

  async getMarkets(options?: {
    limit?: number;
    offset?: number;
    active?: boolean;
  }): Promise<Market[]> {
    const params = new URLSearchParams();
    if (options?.limit) params.set("limit", options.limit.toString());
    if (options?.offset) params.set("offset", options.offset.toString());
    if (options?.active !== undefined)
      params.set("active", options.active.toString());

    const url = `${this.gammaUrl}/markets?${params.toString()}`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch markets: ${response.statusText}`);
    }

    const data = await response.json();
    return MarketsResponseSchema.parse(data);
  }

  async getMarket(id: string): Promise<Market> {
    const url = `${this.gammaUrl}/markets/${id}`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch market: ${response.statusText}`);
    }

    const data = await response.json();
    return MarketSchema.parse(data);
  }

  async searchMarkets(query: string): Promise<Market[]> {
    const params = new URLSearchParams();
    params.set("_q", query);

    const url = `${this.gammaUrl}/markets?${params.toString()}`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to search markets: ${response.statusText}`);
    }

    const data = await response.json();
    return MarketsResponseSchema.parse(data);
  }
}

export const polymarketClient = new PolymarketClient();
