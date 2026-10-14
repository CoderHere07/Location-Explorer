import { PlaceStore } from "./store.js";
import { getLocation } from "./geo.js";
import { filterByCategory } from "./filters.js";
import { markVisited, isVisited } from "./cache.js";
import { withLogging } from "./proxy.js";
import { throttle } from "./utils.js";

const PAGE_SIZE = 10;
const ICONS = { park: "🌳", cafe: "☕", museum: "🏛️", restaurant: "🍽️" };

const listEl = document.getElementById("list");
const sentinel = document.getElementById("sentinel");
const statusEl = document.getElementById("status");
const chipsEl = document.getElementById("chips");
const toTop = document.getElementById("toTop");


const store = PlaceStore.getInstance();  
let center = null;
let activeFilter = filterByCategory("all"); 
let observer = null;

function renderPlace(place) {
  const card = document.createElement("article");
  card.className = "card" + (isVisited(place) ? " visited" : "");
  card.dataset.category = place.category;

  card.style.animationDelay = `${(listEl.children.length % PAGE_SIZE) * 45}ms`;

  const dist = place.distanceFrom(center.lat, center.lng).toFixed(1);
  card.innerHTML = `
    <div class="card-icon">${ICONS[place.category] ?? "📍"}</div>
    <div class="card-body">
      <h3>${place.name}</h3>
      <p>${place.describe()}</p>
      <div class="card-meta">
        <span class="badge">${place.category}</span>
        <span class="dist">📍 ${dist} km away</span>
      </div>
    </div>
    <span class="visited-tick">✓</span>`;

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
      sentinel.classList.add("done");
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
  sentinel.classList.remove("done");
  store.reset(center);
  startObserving();
}

chipsEl.addEventListener("click", (e) => {
  const chip = e.target.closest(".chip");
  if (!chip) return;

  chipsEl
    .querySelectorAll(".chip")
    .forEach((c) => c.classList.toggle("active", c === chip));

  activeFilter = filterByCategory(chip.dataset.category); 
  resetList();
});

window.addEventListener(
  "scroll",
  throttle(() => {
    toTop.classList.toggle("show", window.scrollY > 600);
  }, 200)
);

toTop.addEventListener("click", () =>
  window.scrollTo({ top: 0, behavior: "smooth" })
);

(async function init() {
  statusEl.textContent = "Location dhoond rahe hain…";
  center = await getLocation(); // Geolocation API (fallback: Lahore)

  statusEl.textContent = center.fallback
    ? "📍 Default location (Lahore)"
    : "📍 Aapki location mil gayi";

  resetList();
})();