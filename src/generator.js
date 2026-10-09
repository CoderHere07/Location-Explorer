import { createPlace } from "./place.js";

const CATEGORIES = ["park", "cafe", "museum", "restaurant"];

export function* placeGenerator(center, total = 500) {
  for (let i = 0; i < total; i++) {
    const category = CATEGORIES[i % CATEGORIES.length];
    yield createPlace(category, {
      id: i,
      name: `${category[0].toUpperCase() + category.slice(1)} #${i + 1}`,
      lat: center.lat + (Math.random() - 0.5) * 0.08,
      lng: center.lng + (Math.random() - 0.5) * 0.08,
    });
  }
}