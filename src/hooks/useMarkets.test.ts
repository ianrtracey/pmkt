import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mockMarkets } from '../test/fixtures/markets.js';

// Hoist mocks to avoid initialization issues
const mocks = vi.hoisted(() => ({
  mockSetMarkets: vi.fn(),
  mockSetLoading: vi.fn(),
  mockSetError: vi.fn(),
  mockGetMarkets: vi.fn(),
}));

// Mock React hooks to avoid "invalid hook call" errors
vi.mock('react', () => ({
  useEffect: vi.fn((fn) => fn()),
  useCallback: vi.fn((fn) => fn),
}));

// Mock the store
vi.mock('../store/index.js', () => ({
  useAppStore: () => ({
    markets: [],
    isLoading: false,
    error: null,
    setMarkets: mocks.mockSetMarkets,
    setLoading: mocks.mockSetLoading,
    setError: mocks.mockSetError,
  }),
}));

// Mock the API client
vi.mock('../api/index.js', () => ({
  polymarketClient: {
    getMarkets: mocks.mockGetMarkets,
  },
}));

// Import after mocks are set up
import { useMarkets } from './useMarkets.js';

describe('useMarkets', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns markets state and refresh function', () => {
    const result = useMarkets();

    expect(result).toHaveProperty('markets');
    expect(result).toHaveProperty('isLoading');
    expect(result).toHaveProperty('error');
    expect(result).toHaveProperty('refresh');
    expect(typeof result.refresh).toBe('function');
  });

  it('refresh function calls setLoading and setError at start', async () => {
    mocks.mockGetMarkets.mockResolvedValue(mockMarkets);

    const { refresh } = useMarkets();
    await refresh();

    expect(mocks.mockSetLoading).toHaveBeenCalledWith(true);
    expect(mocks.mockSetError).toHaveBeenCalledWith(null);
  });

  it('refresh function fetches markets with correct params', async () => {
    mocks.mockGetMarkets.mockResolvedValue(mockMarkets);

    const { refresh } = useMarkets();
    await refresh();

    expect(mocks.mockGetMarkets).toHaveBeenCalledWith({ limit: 50, active: true });
  });

  it('refresh function sets markets on success', async () => {
    mocks.mockGetMarkets.mockResolvedValue(mockMarkets);

    const { refresh } = useMarkets();
    await refresh();

    expect(mocks.mockSetMarkets).toHaveBeenCalledWith(mockMarkets);
    expect(mocks.mockSetLoading).toHaveBeenCalledWith(false);
  });

  it('refresh function sets error on failure', async () => {
    const testError = new Error('API failed');
    mocks.mockGetMarkets.mockRejectedValue(testError);

    const { refresh } = useMarkets();
    await refresh();

    expect(mocks.mockSetError).toHaveBeenCalledWith('API failed');
    expect(mocks.mockSetLoading).toHaveBeenCalledWith(false);
  });

  it('refresh function handles non-Error rejection', async () => {
    mocks.mockGetMarkets.mockRejectedValue('string error');

    const { refresh } = useMarkets();
    await refresh();

    expect(mocks.mockSetError).toHaveBeenCalledWith('Failed to fetch markets');
  });
});
