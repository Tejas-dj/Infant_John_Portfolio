export const CATEGORIES = [
  "All",
  "Wedding",
  "Pubs & Restaurants",
  "Automobile",
  "Events",
  "Food",
  "Brand & Influencer",
];

export type Photo = {
  id: number;
  src: string;
  tint: string;
  category: string;
  orientation: "square" | "portrait" | "landscape";
  filename: string;
};

// We create exactly 150 mixed photos so both Honeycomb and Gallery share them
export const COUNT = 150;
const actualCategories = CATEGORIES.slice(1);

export const PHOTOS: Photo[] = Array.from({ length: COUNT }, (_, i) => {
  // Use a prime multiplier to distribute categories pseudo-randomly but deterministically
  const catIndex = (i * 7 + 3) % actualCategories.length;
  
  // Mix orientations
  const aspectRandom = (i * 11 + 5) % 10;
  let orientation: "square" | "portrait" | "landscape" = "portrait"; // 50% portrait
  if (aspectRandom < 3) orientation = "landscape"; // 30% landscape
  else if (aspectRandom < 5) orientation = "square"; // 20% square

  return {
    id: i + 1,
    src: `/images/photography/honeycomb/photo-${String(i + 1).padStart(2, "0")}.jpg`,
    tint: `hsl(${28 + (i * 11) % 28},${18 + (i * 5) % 26}%,${68 + (i * 4) % 22}%)`,
    category: actualCategories[catIndex],
    orientation,
    filename: `photo-${String(i + 1).padStart(2, "0")}.jpg`,
  };
});
