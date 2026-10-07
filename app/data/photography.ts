export const CATEGORIES = [
  'Auto Mobile',
  'Family Events',
  'Food',
  'Potraits',
  'Jewellery',
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
