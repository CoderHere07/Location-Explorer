import { createPlace, PlaceProto, ParkProto} from './place.js';
const place = createPlace("park", {id:1, name:"Jinnah Park", lat:31.52, lng:74.35});
console.log(place.describe())
console.log(Object.getPrototypeOf(place) === ParkProto);
console.log(PlaceProto.isPrototypeOf(place));
console.log(place.hasOwnProperty("describe"));
console.log(place.hasOwnProperty("name"));
console.log(typeof place.distanceFrom);