// script.js

// Basic state
let currentEventId = EVENTS[0]?.id || null;
let currentPerson = "all";

const GALLERY_COUNT_LIMIT = 200;       // Safety cap
const COLLAGE_ITEM_COUNT = 6;          // How many tiles in collage
const COLLAGE_INTERVAL_MS = 6000;      // Shuffle every 6s

let collageIntervalId = null;

// DOM elements
const eventSelectEl = document.getElementById("eventSelect");
const personFilterEl = document.getElementById("personFilter");
const heroTitleEl = document.getElementById("hero-title");
const heroDescEl = document.getElementById("hero-description");
const galleryEl = document.getElementById("gallery");
const emptyMessageEl = document.getElementById("emptyMessage");
const collageGridEl = document.getElementById("collageGrid");
const collageToggleEl = document.getElementById("collageToggle");

function init() {
  populateEventSelect();
  populatePersonFilter();
  updateHero();
  renderGallery();
  buildInitialCollage();
  startCollageLoop();

  eventSelectEl.addEventListener("change", () => {
    currentEventId = eventSelectEl.value;
    updateHero();
    renderGallery();
  });

  personFilterEl.addEventListener("change", () => {
    currentPerson = personFilterEl.value;
    renderGallery();
  });

  collageToggleEl.addEventListener("click", toggleCollage);
}

function populateEventSelect() {
  eventSelectEl.innerHTML = "";

  EVENTS.forEach(event => {
    const opt = document.createElement("option");
    opt.value = event.id;
    opt.textContent = event.name;
    eventSelectEl.appendChild(opt);
  });

  if (currentEventId) {
    eventSelectEl.value = currentEventId;
  }
}

function populatePersonFilter() {
  // Collect unique people tags
  const peopleSet = new Set();

  MEDIA_ITEMS.forEach(item => {
    (item.people || []).forEach(p => peopleSet.add(p));
  });

  // Clear existing except "all"
  personFilterEl.innerHTML = "";
  const allOpt = document.createElement("option");
  allOpt.value = "all";
  allOpt.textContent = "Everyone";
  personFilterEl.appendChild(allOpt);

  Array.from(peopleSet)
    .sort((a, b) => a.localeCompare(b))
    .forEach(person => {
      const opt = document.createElement("option");
      opt.value = person;
      opt.textContent = person;
      personFilterEl.appendChild(opt);
    });

  personFilterEl.value = currentPerson;
}

function updateHero() {
  const event = EVENTS.find(e => e.id === currentEventId);
  if (!event) return;

  heroTitleEl.textContent = event.name;
  heroDescEl.textContent = event.description || "";
}

function getFilteredMedia() {
  return MEDIA_ITEMS.filter(item => {
    const eventOk = !currentEventId || item.eventId === currentEventId;
    const personOk =
      currentPerson === "all" ||
      (item.people || []).includes(currentPerson);
    return eventOk && personOk;
  }).slice(0, GALLERY_COUNT_LIMIT);
}

function renderGallery() {
  const items = getFilteredMedia();
  galleryEl.innerHTML = "";

  if (items.length === 0) {
    emptyMessageEl.hidden = false;
    return;
  }

  emptyMessageEl.hidden = true;

  const fragment = document.createDocumentFragment();

  items.forEach(item => {
    const card = document.createElement("article");
    card.className = "gallery-item";

    let mediaEl;
    if (item.type === "video") {
      mediaEl = document.createElement("video");
      mediaEl.src = item.src;
      mediaEl.controls = true;
      mediaEl.preload = "metadata";
    } else {
      mediaEl = document.createElement("img");
      mediaEl.src = item.src;
      mediaEl.alt = item.caption || "";
      mediaEl.loading = "lazy";
    }

    const meta = document.createElement("div");
    meta.className = "gallery-meta";

    const caption = document.createElement("div");
    caption.className = "gallery-caption";
    caption.textContent = item.caption || "";

    const tagsWrap = document.createElement("div");
    tagsWrap.className = "gallery-tags";

    (item.people || []).forEach(p => {
      const tag = document.createElement("span");
      tag.className = "tag";
      tag.textContent = p;
      tagsWrap.appendChild(tag);
    });

    meta.appendChild(caption);
    meta.appendChild(tagsWrap);

    card.appendChild(mediaEl);
    card.appendChild(meta);
    fragment.appendChild(card);
  });

  galleryEl.appendChild(fragment);
}

/* ---------- COLLAGE LOGIC ---------- */

function buildInitialCollage() {
  const pool = [...MEDIA_ITEMS];
  const selection = pickRandomDistinct(pool, COLLAGE_ITEM_COUNT);
  renderCollage(selection);
}

function renderCollage(items) {
  collageGridEl.innerHTML = "";
  const fragment = document.createDocumentFragment();

  items.forEach(item => {
    const wrapper = document.createElement("div");
    wrapper.className = "collage-item";

    let mediaEl;
    if (item.type === "video") {
      mediaEl = document.createElement("video");
      mediaEl.src = item.src;
      mediaEl.autoplay = true;
      mediaEl.muted = true;
      mediaEl.loop = true;
      mediaEl.playsInline = true;
    } else {
      mediaEl = document.createElement("img");
      mediaEl.src = item.src;
      mediaEl.alt = item.caption || "";
      mediaEl.loading = "lazy";
    }

    wrapper.appendChild(mediaEl);
    fragment.appendChild(wrapper);
  });

  collageGridEl.appendChild(fragment);
}

function startCollageLoop() {
  if (collageIntervalId) clearInterval(collageIntervalId);
  if (MEDIA_ITEMS.length === 0) return;

  collageIntervalId = setInterval(() => {
    const pool = [...MEDIA_ITEMS];
    const selection = pickRandomDistinct(pool, COLLAGE_ITEM_COUNT);
    renderCollage(selection);
  }, COLLAGE_INTERVAL_MS);
}

function stopCollageLoop() {
  if (collageIntervalId) {
    clearInterval(collageIntervalId);
    collageIntervalId = null;
  }
}

function toggleCollage() {
  if (collageIntervalId) {
    stopCollageLoop();
    collageToggleEl.textContent = "Resume Collage";
  } else {
    startCollageLoop();
    collageToggleEl.textContent = "Pause Collage";
  }
}

// Utility: pick N random distinct items from array
function pickRandomDistinct(arr, n) {
  const copy = [...arr];
  const result = [];

  const limit = Math.min(n, copy.length);
  for (let i = 0; i < limit; i++) {
    const idx = Math.floor(Math.random() * copy.length);
    result.push(copy.splice(idx, 1)[0]);
  }
  return result;
}

// Init when DOM ready
document.addEventListener("DOMContentLoaded", init);
