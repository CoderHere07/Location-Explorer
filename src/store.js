import { generatePool, placeGenerator } from "./generator.js";
import { sortByDistance } from "./filters.js";

export const PlaceStore = (function () {
  let instance = null;

  function init() {
    const places = []; // ab tak load hui places (current order me)
    let pool = [];     // poori places, ek baar bani, kabhi mutate nahi hoti
    let gen = null;

    return {
      // Naya location milne par: pool banta hai, default order
      reset(center) {
        places.length = 0;
        pool = generatePool(center);
        gen = placeGenerator(pool);
      },
      // Order badalne par: wahi pool, naya generator. nearestFirst=true -> sortByDistance
      reorder(center, nearestFirst) {
        places.length = 0;
        const ordered = nearestFirst ? sortByDistance(center)(pool) : pool;
        gen = placeGenerator(ordered);
      },
      loadMore(n = 10) {
        const batch = [];
        for (let i = 0; i < n; i++) {
          const { value, done } = gen.next();
          if (done) break;
          batch.push(value);
          places.push(value);
        }
        return batch;
      },
      getAll() {
        return [...places];
      },
    };
  }

  return {
    getInstance() {
      if (!instance) instance = init();
      return instance;
    },
  };
})();