export const CATEGORIES = [
  'All',
  'Auto Mobile',
  'Family Events',
  'Food',
  'Potraits',
  'Product',
  'Pub and Nightlife',
  'Wedding',
];

export type Photo = {
  id: number;
  src: string;
  tint: string;
  category: string;
  orientation: 'square' | 'portrait' | 'landscape';
  filename: string;
  width: number;
  height: number;
};
