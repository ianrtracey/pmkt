import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock event data
const mockEvents = [
  {
    id: '12345',
    title: 'Test Event 1',
    slug: 'test-event-1',
    active: true,
    volume: 100000,
    markets: [],
  },
  {
    id: '67890',
    title: 'Test Event 2',
    slug: 'test-event-2',
    active: true,
    volume: 50000,
    markets: [],
  },
];

// Hoist mocks to avoid initialization issues
const mocks = vi.hoisted(() => ({
  mockSetEvents: vi.fn(),
  mockSetLoading: vi.fn(),
  mockSetError: vi.fn(),
  mockGetEvents: vi.fn(),
}));

// Mock React hooks to avoid "invalid hook call" errors
vi.mock('react', () => ({
  useEffect: vi.fn((fn) => fn()),
  useCallback: vi.fn((fn) => fn),
}));

// Mock the store
vi.mock('../store/index.js', () => ({
  useAppStore: () => ({
    events: [],
    isLoading: false,
    error: null,
    setEvents: mocks.mockSetEvents,
    setLoading: mocks.mockSetLoading,
    setError: mocks.mockSetError,
  }),
}));

// Mock the API client
vi.mock('../api/index.js', () => ({
  polymarketClient: {
    getEvents: mocks.mockGetEvents,
  },
}));

// Import after mocks are set up
import { useEvents } from './useEvents.js';

describe('useEvents', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns events state and refresh function', () => {
    const result = useEvents();

    expect(result).toHaveProperty('events');
    expect(result).toHaveProperty('isLoading');
    expect(result).toHaveProperty('error');
    expect(result).toHaveProperty('refresh');
    expect(typeof result.refresh).toBe('function');
  });

  it('refresh function calls setLoading and setError at start', async () => {
    mocks.mockGetEvents.mockResolvedValue(mockEvents);

    const { refresh } = useEvents();
    await refresh();

    expect(mocks.mockSetLoading).toHaveBeenCalledWith(true);
    expect(mocks.mockSetError).toHaveBeenCalledWith(null);
  });

  it('refresh function fetches events with correct params', async () => {
    mocks.mockGetEvents.mockResolvedValue(mockEvents);

    const { refresh } = useEvents();
    await refresh();

    expect(mocks.mockGetEvents).toHaveBeenCalledWith({
      limit: 25,
      active: true,
      closed: false,
      ascending: false,
    });
  });

  it('refresh function sets events on success', async () => {
    mocks.mockGetEvents.mockResolvedValue(mockEvents);

    const { refresh } = useEvents();
    await refresh();

    expect(mocks.mockSetEvents).toHaveBeenCalledWith(mockEvents);
    expect(mocks.mockSetLoading).toHaveBeenCalledWith(false);
  });

  it('refresh function sets error on failure', async () => {
    const testError = new Error('API failed');
    mocks.mockGetEvents.mockRejectedValue(testError);

    const { refresh } = useEvents();
    await refresh();

    expect(mocks.mockSetError).toHaveBeenCalledWith('API failed');
    expect(mocks.mockSetLoading).toHaveBeenCalledWith(false);
  });

  it('refresh function handles non-Error rejection', async () => {
    mocks.mockGetEvents.mockRejectedValue('string error');

    const { refresh } = useEvents();
    await refresh();

    expect(mocks.mockSetError).toHaveBeenCalledWith('Failed to fetch events');
  });
});
