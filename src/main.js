import { createPlace, PlaceProto, ParkProto} from './place.js';
import { PlaceStore } from "./store.js";
import { withLogging } from "./proxy.js";
import { markVisited, isVisited } from "./cache.js";

const place = createPlace("park", {id:1, name:"Jinnah Park", lat:31.52, lng:74.35});
console.log(place.describe())
console.log(Object.getPrototypeOf(place) === ParkProto);
console.log(PlaceProto.isPrototypeOf(place));
console.log(place.hasOwnProperty("describe"));
console.log(place.hasOwnProperty("name"));
console.log(typeof place.distanceFrom);


const a = PlaceStore.getInstance();
const b = PlaceStore.getInstance();
console.log(a === b);

a.reset({ lat: 31.52, lng: 74.35 });
console.log(a.loadMore(5).length);
console.log(b.getAll().length);



const raw = createPlace("cafe", { id: 9, name: "Coffee Hub", lat: 31.5, lng: 74.3 });
const logged = withLogging(raw);

logged.name;
logged.name = "Coffee Hub 2";
logged.describe();

markVisited(raw);
console.log(isVisited(raw));
console.log(isVisited(logged));