export const filterByCategory = (category) => (places) =>
  category === "all" ? places : places.filter((p) => p.category === category);

export const filterByRadius = (km) => (center) => (places) =>
  places.filter((p) => p.distanceFrom(center.lat, center.lng) <= km);

export const sortByDistance = (center) => (places) =>
  [...places].sort(
    (a, b) => a.distanceFrom(center.lat, center.lng) - b.distanceFrom(center.lat, center.lng)
  );

export const pipe = (...fns) => (x) => fns.reduce((acc, fn) => fn(acc), x);