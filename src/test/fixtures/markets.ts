import type { Market } from '../../api/client.js';

export const mockMarket: Market = {
  id: '12345',
  question: 'Will Bitcoin reach $100k by end of 2025?',
  conditionId: 'condition-12345',
  slug: 'bitcoin-100k-2025',
  endDate: '2025-12-31T23:59:59Z',
  liquidity: '125000',
  volume: '500000',
  volume24hr: 25000,
  outcomes: ['Yes', 'No'],
  outcomePrices: ['0.42', '0.58'],
  active: true,
};

export const mockMarket2: Market = {
  id: '67890',
  question: 'Will the Fed cut rates in Q1 2025?',
  conditionId: 'condition-67890',
  slug: 'fed-rates-q1-2025',
  endDate: '2025-03-31T23:59:59Z',
  liquidity: '89000',
  volume: '200000',
  volume24hr: 15000,
  outcomes: ['Yes', 'No'],
  outcomePrices: ['0.65', '0.35'],
  active: true,
};

export const mockMarkets: Market[] = [mockMarket, mockMarket2];

export const mockInactiveMarket: Market = {
  id: '11111',
  question: 'Resolved market example',
  conditionId: 'condition-11111',
  slug: 'resolved-market',
  endDate: '2024-01-01T00:00:00Z',
  liquidity: '0',
  volume: '100000',
  outcomes: ['Yes', 'No'],
  outcomePrices: ['1', '0'],
  active: false,
};

export const invalidMarketData = {
  id: 12345, // should be string
  question: 'Invalid market',
};
