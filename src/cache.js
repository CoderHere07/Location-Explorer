const visited = new WeakMap();

export function markVisited(place) {
  const prev = visited.get(place);
  visited.set(place, { count: (prev?.count ?? 0) + 1, lastAt: Date.now() });
}
export function unmarkVisited(place) {
  visited.delete(place);
}

export const isVisited = (place) => visited.has(place);
export const getVisitInfo = (place) => visited.get(place);