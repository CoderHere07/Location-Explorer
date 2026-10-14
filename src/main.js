import { PlaceStore } from "./store.js";
import { getLocation } from "./geo.js";
import { filterByCategory, filterByRadius, sortByDistance, pipe } from "./filters.js";
import { markVisited, isVisited } from "./cache.js";
import { withLogging } from "./proxy.js";
import { throttle } from "./utils.js";

const PAGE_SIZE = 10;
const ICONS = { park: "🌳", cafe: "☕", museum: "🏛️", restaurant: "🍽️" };

// ---------- DOM ----------
const listEl = document.getElementById("list");
const sentinel = document.getElementById("sentinel");
const statusEl = document.getElementById("status");
const chipsEl = document.getElementById("chips");
const radiusEl = document.getElementById("radius");
const toTop = document.getElementById("toTop");

// ---------- State ----------
const store = PlaceStore.getInstance();
let center = null;
let category = "all";
let radiusKm = Number(radiusEl.value);
let observer = null;
let finished = false;
let locationLabel = "Location dhoond rahe hain…";

const buildView = () =>
  pipe(
    filterByCategory(category),
    filterByRadius(radiusKm)(center),
    sortByDistance(center)
  );

function updateStatus() {
  const count = listEl.children.length;
  statusEl.textContent =
    finished && count === 0
      ? "😕 Koi place nahi mili"
      : `${locationLabel} · ${count}`;
}

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

function finish() {
  finished = true;
  observer?.disconnect();
  sentinel.classList.add("done");
  updateStatus();
}

function loadNext() {
  const view = buildView();
  let added = 0;

  while (added < PAGE_SIZE) {
    const batch = store.loadMore(PAGE_SIZE);
    if (batch.length === 0) {
      finish();
      return;
    }
    const matched = view(batch);
    matched.forEach(renderPlace);
    added += matched.length;
  }
  updateStatus();
}

function startObserving() {
  observer?.disconnect();

  const io = new IntersectionObserver(
    (entries) => {
      if (!entries[0].isIntersecting) return;

      loadNext();

      if (!finished) {
        io.unobserve(sentinel);
        io.observe(sentinel);
      }
    },
    { rootMargin: "200px" }
  );

  observer = io;
  io.observe(sentinel);
}


function applyView() {
  listEl.innerHTML = "";
  sentinel.classList.remove("done");
  finished = false;

  buildView()(store.getAll()).forEach(renderPlace);
  updateStatus();
  startObserving();
}


chipsEl.addEventListener("click", (e) => {
  const chip = e.target.closest(".chip");
  if (!chip) return;

  chipsEl
    .querySelectorAll(".chip")
    .forEach((c) => c.classList.toggle("active", c === chip));

  category = chip.dataset.category;
  applyView();
});

radiusEl.addEventListener("change", () => {
  radiusKm = Number(radiusEl.value);
  applyView();
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
  statusEl.textContent = locationLabel;
  center = await getLocation();

  locationLabel = center.fallback ? "📍 Lahore (default)" : "📍 Aapki location";

  store.reset(center);
  applyView();
})();