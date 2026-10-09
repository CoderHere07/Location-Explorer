import { PlaceStore } from "./store.js";
import { getLocation } from "./geo.js";
import { filterByCategory } from "./filters.js";
import { markVisited, isVisited } from "./cache.js";
import { withLogging } from "./proxy.js";
import { throttle } from "./utils.js";

const PAGE_SIZE = 10;
const listEl = document.getElementById("list");
const sentinel = document.getElementById("sentinel");
const statusEl = document.getElementById("status");
const filterEl = document.getElementById("categoryFilter");
const toTop = document.getElementById("toTop");

const store = PlaceStore.getInstance();
let center = null;
let activeFilter = filterByCategory("all");
let observer = null;

function renderPlace(place) {
  const card = document.createElement("article");
  card.className = "card" + (isVisited(place) ? " visited" : "");
  const dist = place.distanceFrom(center.lat, center.lng).toFixed(1);
  card.innerHTML = `<h3>${place.name}</h3><p>${place.describe()}</p><small>${dist} km away</small>`;

  card.addEventListener("click", () => {
    markVisited(place);
    card.classList.add("visited");
    const logged = withLogging(place);
    logged.name = place.name.replace(" ✓", "") + " ✓";
    card.querySelector("h3").textContent = place.name;
  });

  listEl.appendChild(card);
}

function loadNext() {
  let added = 0;
  let guard = 0;
  while (added < PAGE_SIZE && guard++ < 20) {
    const batch = store.loadMore(PAGE_SIZE);
    if (batch.length === 0) {
      observer.disconnect();
      statusEl.textContent = "Saari places load ho gayin";
      return;
    }
    const matched = activeFilter(batch);
    matched.forEach(renderPlace);
    added += matched.length;
  }
}

function startObserving() {
  observer?.disconnect();
  observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) loadNext();
    },
    { rootMargin: "200px" }
  );
  observer.observe(sentinel);
}

function resetList() {
  listEl.innerHTML = "";
  store.reset(center);
  startObserving();
}

filterEl.addEventListener("change", (e) => {
  activeFilter = filterByCategory(e.target.value);
  resetList();
});

window.addEventListener(
  "scroll",
  throttle(() => {
    toTop.hidden = window.scrollY < 600;
  }, 200)
);
toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

// Start
(async function init() {
  statusEl.textContent = "Location Finding…";
  center = await getLocation();
  statusEl.textContent = center.fallback ? "Default location (Lahore)" : "I got your location";
  resetList();
})();