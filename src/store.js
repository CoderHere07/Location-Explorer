import { generatePool, placeGenerator } from "./generator.js";
import { sortByDistance } from "./filters.js";

export const PlaceStore = (function () {
  let instance = null;

  function init() {
    const places = [];
    let gen = null;

    return {
      
      reset(center) {
        places.length = 0;
        const sortedPool = sortByDistance(center)(generatePool(center));
        gen = placeGenerator(sortedPool);
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