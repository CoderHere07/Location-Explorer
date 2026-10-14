# 📍 Infinite Scroll Location Explorer

A vanilla JavaScript app that detects your location and lists nearby places with infinite scrolling. It is built to demonstrate core and advanced JavaScript concepts in a single, practical project: prototypal inheritance, generators, `WeakMap` caching, `Proxy` logging, the module + singleton pattern, currying, throttling, `IntersectionObserver` and the Geolocation API.

**Live demo:** `<add-your-vercel-link-here>`

<!-- Add a screenshot or GIF: ![Location Explorer](./screenshots/demo.png) -->

---

## ✨ Features

- **Infinite scroll** powered by `IntersectionObserver` (no scroll-event polling for loading)
- **Geolocation** to center the app on your current position, with a Lahore fallback if permission is denied
- **Category filters** (All, Parks, Cafes, Museums, Restaurants) that keep already loaded places instead of regenerating them
- **Nearby mode** (opt-in button): sorts places nearest-first and filters by radius (1, 2, 3, 5 km or all)
- **Visited toggle:** click a card to mark it visited, click again to unmark it
- **Throttled scroll handler** for the back-to-top button
- **Responsive, dark-mode-aware UI** with glass header, color-coded cards and entry animations

---

## 🧠 JavaScript concepts demonstrated

| # | Concept | Where | How it is used |
|---|---------|-------|----------------|
| 1 | Prototypes with `Object.create()` | `src/place.js` | `PlaceProto` is the base; `ParkProto`, `CafeProto`, etc. inherit from it and override `describe()` |
| 2 | Generator function | `src/generator.js` | `placeGenerator` yields places one at a time |
| 3 | `WeakMap` | `src/cache.js` | Tracks visited places without preventing garbage collection |
| 4 | `Proxy` | `src/proxy.js` | `withLogging` logs every get/set on a place object |
| 5 | Module pattern + Singleton | `src/store.js` | `PlaceStore.getInstance()` always returns the same private-state store |
| 6 | Currying | `src/filters.js` | `filterByCategory("park")(places)`, `filterByRadius(km)(center)(places)` |
| 7 | Throttle | `src/utils.js` | Limits how often the scroll handler runs |
| 8 | `IntersectionObserver` | `src/main.js` | A sentinel element triggers loading the next batch |
| 9 | Geolocation API | `src/geo.js` | Gets the user's coordinates to compute distances |

### Quick examples

```js
// Prototype inheritance
const park = createPlace("park", { id: 1, name: "Jinnah Park", lat: 31.52, lng: 74.35 });
Object.getPrototypeOf(park) === ParkProto; // true
PlaceProto.isPrototypeOf(park);            // true

// Currying + composition
const nearbyParks = pipe(
  filterByCategory("park"),
  filterByRadius(3)(center),
  sortByDistance(center)
);

// Proxy logging
const logged = withLogging(place);
logged.name = "New name"; // [SET] name: Old name → New name
```

---

## 🗂️ Project structure

```
location-explorer/
├── index.html
├── style.css
└── src/
    ├── main.js        # UI, events, infinite scroll wiring
    ├── place.js       # Object.create() prototypes + createPlace factory
    ├── generator.js   # place pool + generator
    ├── store.js       # module pattern + singleton data store
    ├── cache.js       # WeakMap for visited places
    ├── proxy.js       # Proxy logger
    ├── filters.js     # curried filters, sortByDistance, pipe
    ├── geo.js         # Geolocation API wrapper
    ├── utils.js       # haversine distance + throttle
    └── tests.js       # console tests for the concepts (run with Node)
```

---

## 🚀 Getting started

ES modules and the Geolocation API do not work over `file://`, so run the project with a local server.

```bash
# clone
git clone https://github.com/CoderHere07/Location-Explorer.git
cd Location-Explorer

# option 1
npx serve

# option 2
python3 -m http.server 8000
```

Open the printed URL (for example `http://localhost:3000`) and allow location access when the browser asks. `localhost` counts as a secure origin, so HTTPS is not required during development.

### Run the console tests

```bash
echo '{ "type": "module" }' > package.json   # only needed once
node src/tests.js
```

`geo.js` and `main.js` use browser APIs, so they are tested in the browser, not in Node.

---

## ⚙️ How it works

1. **Location:** `getLocation()` resolves with the user's coordinates, or a fallback location if permission is denied.
2. **Pool:** the store generates a pool of places around that location once. Filters never regenerate it.
3. **Generator:** `placeGenerator` yields places from the pool one by one, and `store.loadMore(n)` pulls the next batch.
4. **Infinite scroll:** an `IntersectionObserver` watches a sentinel element below the list. When it becomes visible, the next batch is loaded. After each load the sentinel is unobserved and observed again, so loading continues while it is still on screen.
5. **Filters:** changing category or radius clears the DOM and re-renders the already loaded places through the curried filter pipeline, then continues loading on scroll.
6. **Nearby mode:** the pool is sorted with `sortByDistance`, the generator restarts from the nearest place, and the radius filter is applied.
7. **Visited state:** stored in a `WeakMap` keyed by the raw place object. Keys must be raw objects, not Proxy-wrapped ones, since `proxy !== target`.

---

## 🛠️ Tech stack

- HTML5, CSS3 (custom properties, `color-mix`, animations, dark mode via `prefers-color-scheme`)
- Vanilla JavaScript (ES modules), no frameworks or build step
- Browser APIs: Geolocation, IntersectionObserver

---

## 🔮 Future improvements

- Real places data from the OpenStreetMap Overpass API (fetch once, sort once, yield lazily through the generator)
- Map view with markers (Leaflet)
- Search by name and favorites saved in `localStorage`
- Port to React as a follow-up

---

## 👤 Author

**Adnan Shahzad**
GitHub: [@CoderHere07](https://github.com/CoderHere07)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).