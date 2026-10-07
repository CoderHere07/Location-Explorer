import { distanceKm } from './utils.js';
export const PlaceProto = {
    describe() {
        return `${this.name} (${this.category}) `
    },
    distanceFrom(lat, lng){
        return distanceKm(this.lat, this.lng, lat, lng);
    },
};


export const ParkProto = Object.create(PlaceProto);

ParkProto.describe = function(){
    return `${PlaceProto.describe.call(this)}, free entry`;
};

export const CafeProto = Object.create(PlaceProto);
CafeProto.describe = function(){
    return `${PlaceProto.describe.call(this)}, open till 11pm`;
}


export const MuseumProto = Object.create(PlaceProto);
export const RestaurantProto = Object.create(PlaceProto);


const protoMap = {
    park: ParkProto,
    cafe: CafeProto,
    museum: MuseumProto,
    restaurant: RestaurantProto,
}

export function createPlace(category, data){
    const proto = protoMap[category] ?? PlaceProto;
    return Object.assign(Object.create(proto), {category, ...data});
}