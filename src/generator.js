import { createPlace } from "./place.js";

const CATEGORIES = ["park", "cafe", "museum", "restaurant"];
const cap = (s) => s[0].toUpperCase() + s.slice(1);

export function generatePool(center, total = 500) {
  const pool = [];
  for (let i = 0; i < total; i++) {
    const category = CATEGORIES[i % CATEGORIES.length];
    pool.push(
      createPlace(category, {
        id: i,
        name: `${cap(category)} #${i + 1}`,
        lat: center.lat + (Math.random() - 0.5) * 0.08, 
        lng: center.lng + (Math.random() - 0.5) * 0.08,
      })
    );
  }
  return pool;
}

export function* placeGenerator(pool) {
  for (const place of pool) {
    yield place;
  }
}