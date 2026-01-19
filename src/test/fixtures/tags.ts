import type { Tag } from '../../api/client.js';

export const mockTag: Tag = {
  id: 'tag-1',
  slug: 'politics',
  label: 'Politics',
  name: 'Politics',
};

export const mockTag2: Tag = {
  id: 'tag-2',
  slug: 'crypto',
  label: 'Crypto',
  name: 'Cryptocurrency',
};

export const mockTag3: Tag = {
  id: 'tag-3',
  slug: 'sports',
  label: 'Sports',
  name: 'Sports',
};

export const mockTags: Tag[] = [mockTag, mockTag2, mockTag3];

export const invalidTagData = {
  id: 123, // valid but slug is missing
  label: 'Invalid Tag',
};
