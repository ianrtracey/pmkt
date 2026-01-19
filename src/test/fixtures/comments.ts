import type { Comment } from '../../api/client.js';

export const mockComment: Comment = {
  id: 'comment-123',
  body: 'This is a test comment about the market',
  parentEntityType: 'Event',
  parentEntityID: 12345,
  userAddress: '0x1234567890abcdef1234567890abcdef12345678',
  createdAt: '2024-01-15T10:30:00Z',
  updatedAt: '2024-01-15T10:30:00Z',
  profile: {
    name: 'John Doe',
    pseudonym: 'johnd',
    bio: 'Crypto enthusiast',
    profileImage: 'https://example.com/avatar.png',
  },
  reactionCount: 5,
  reportCount: 0,
};

export const mockComments: Comment[] = [
  mockComment,
  {
    id: 'comment-456',
    body: 'Another insightful comment',
    parentEntityType: 'Event',
    parentEntityID: 12345,
    userAddress: '0xabcdef1234567890abcdef1234567890abcdef12',
    createdAt: '2024-01-14T15:45:00Z',
    updatedAt: '2024-01-14T15:45:00Z',
    profile: {
      name: null,
      pseudonym: 'anon_user',
      bio: null,
      profileImage: null,
    },
    reactionCount: 2,
    reportCount: 0,
  },
  {
    id: 'comment-789',
    body: 'Great prediction market!',
    parentEntityType: 'Event',
    parentEntityID: 12345,
    userAddress: '0x9876543210fedcba9876543210fedcba98765432',
    createdAt: '2024-01-13T09:00:00Z',
    updatedAt: '2024-01-13T09:00:00Z',
    profile: null,
    reactionCount: 0,
    reportCount: 0,
  },
];

export const invalidCommentData = {
  // Missing required 'id' field
  body: 'Invalid comment without id',
};
