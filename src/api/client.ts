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
  liquidity: z.string().optional(),
  volume: z.string(),
  volume24hr: z.number().optional(),
  outcomes: jsonStringArray,
  outcomePrices: jsonStringArray,
  active: z.boolean(),
}).passthrough();

export type Market = z.infer<typeof MarketSchema>;

export const MarketsResponseSchema = z.array(MarketSchema);

export const EventSchema = z.object({
  id: z.string(),
  ticker: z.string().nullable().optional(),
  slug: z.string().nullable().optional(),
  title: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  startDate: z.string().nullable().optional(),
  endDate: z.string().nullable().optional(),
  creationDate: z.string().nullable().optional(),
  image: z.string().nullable().optional(),
  active: z.boolean().nullable().optional(),
  closed: z.boolean().nullable().optional(),
  archived: z.boolean().nullable().optional(),
  featured: z.boolean().nullable().optional(),
  liquidity: z.number().nullable().optional(),
  volume: z.number().nullable().optional(),
  volume24hr: z.number().nullable().optional(),
  markets: z.array(MarketSchema).optional(),
}).passthrough();

export type Event = z.infer<typeof EventSchema>;

export const EventsResponseSchema = z.array(EventSchema);

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

  async getEvents(options?: {
    limit?: number;
    offset?: number;
    active?: boolean;
    closed?: boolean;
    ascending?: boolean;
  }): Promise<Event[]> {
    const params = new URLSearchParams();
    if (options?.limit) params.set("limit", options.limit.toString());
    if (options?.offset) params.set("offset", options.offset.toString());
    if (options?.active !== undefined)
      params.set("active", options.active.toString());
    if (options?.closed !== undefined)
      params.set("closed", options.closed.toString());
    if (options?.ascending !== undefined)
      params.set("ascending", options.ascending.toString());

    const url = `${this.gammaUrl}/events?${params.toString()}`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch events: ${response.statusText}`);
    }

    const data = await response.json();
    return EventsResponseSchema.parse(data);
  }

  async getEvent(id: string): Promise<Event> {
    const url = `${this.gammaUrl}/events/${id}`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch event: ${response.statusText}`);
    }

    const data = await response.json();
    return EventSchema.parse(data);
  }
}

export const polymarketClient = new PolymarketClient();
