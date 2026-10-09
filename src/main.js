import { PlaceStore } from "./store.js";
const a = PlaceStore.getInstance();
const b = PlaceStore.getInstance();
console.log(a === b);

a.reset({ lat: 31.52, lng: 74.35 });
console.log(a.loadMore(5).length);
console.log(b.getAll().length);