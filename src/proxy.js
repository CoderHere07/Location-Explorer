export function withLogging(place) {
  return new Proxy(place, {
    get(target, prop, receiver) {
      if (typeof prop === "string") console.log(`[GET] ${prop} ->`, target[prop]);
      return Reflect.get(target, prop, receiver);
    },
    set(target, prop, value, receiver) {
      console.log(`[SET] ${prop}: ${target[prop]} → ${value}`);
      return Reflect.set(target, prop, value, receiver);
    },
  });
}