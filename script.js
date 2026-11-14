let storeData = null;
let currentCategory = "All";
let currentSearch = "";

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

async function init() {
  try {
    const res = await fetch("apps.json");
    storeData = await res.json();
  } catch (e) {
    console.error("Failed to load apps.json", e);
    showToast("Could not load app data");
    return;
  }

  // Apply store branding
  document.title = storeData.storeName || "My App Store";
  $("#storeTitle").textContent = storeData.storeName || "My App Store";
  $("#storeTagline").textContent = storeData.storeTagline || "";
  $(".logo-text").textContent = storeData.storeName || "My App Store";

  renderCategories();
  renderFeatured();
  renderApps();
  setupEvents();
  loadTheme();
}

function setupEvents() {
  // Search
  const input = $("#searchInput");
  const clearBtn = $("#searchClear");

  input.addEventListener("input", () => {
    currentSearch = input.value.trim().toLowerCase();
    clearBtn.hidden = !currentSearch;
    renderApps();
  });

  clearBtn.addEventListener("click", () => {
    input.value = "";
    currentSearch = "";
    clearBtn.hidden = true;
    renderApps();
    input.focus();
  });

  // Theme
  $("#themeToggle").addEventListener("click", toggleTheme);

  // Logo click → reset
  $("#logo").addEventListener("click", () => {
    currentCategory = "All";
    currentSearch = "";
    input.value = "";
    clearBtn.hidden = true;
    $$(".cat-chip").forEach((c) => c.classList.toggle("active", c.dataset.cat === "All"));
    renderApps();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // Modal close
  $("#modalClose").addEventListener("click", closeModal);
  $("#modalOverlay").addEventListener("click", (e) => {
    if (e.target === $("#modalOverlay")) closeModal();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });
}

function renderCategories() {
  const container = $("#categories");
  container.innerHTML = "";

  (storeData.categories || ["All"]).forEach((cat) => {
    const chip = document.createElement("button");
    chip.className = "cat-chip" + (cat === currentCategory ? " active" : "");
    chip.dataset.cat = cat;
    chip.textContent = cat;
    chip.addEventListener("click", () => {
      currentCategory = cat;
      $$(".cat-chip").forEach((c) => c.classList.toggle("active", c.dataset.cat === cat));
      renderApps();
    });
    container.appendChild(chip);
  });
}

function renderFeatured() {
  const container = $("#featuredCarousel");
  container.innerHTML = "";

  const featuredIds = storeData.featured || [];
  const featuredApps = featuredIds
    .map((id) => storeData.apps.find((a) => a.id === id))
    .filter(Boolean);

  if (featuredApps.length === 0) {
    // fallback: top rated
    featuredApps.push(...[...storeData.apps].sort((a, b) => b.rating - a.rating).slice(0, 3));
  }

  featuredApps.forEach((app) => {
    const card = document.createElement("div");
    card.className = "featured-card";
    card.innerHTML = `
      <img class="app-icon" src="${app.icon}" alt="${app.name}" loading="lazy" />
      <div class="featured-info">
        <h3>${escapeHtml(app.name)}</h3>
        <div class="dev">${escapeHtml(app.developer)}</div>
        <div class="desc">${escapeHtml(app.shortDescription)}</div>
        <div class="featured-meta">
          <div class="rating">★ ${app.rating} <span>(${app.reviewsCount})</span></div>
          <span>${app.downloads}</span>
        </div>
      </div>
    `;
    card.addEventListener("click", () => openModal(app));
    container.appendChild(card);
  });
}

function getFilteredApps() {
  return storeData.apps.filter((app) => {
    const matchCat = currentCategory === "All" || app.category === currentCategory;
    const matchSearch =
      !currentSearch ||
      app.name.toLowerCase().includes(currentSearch) ||
      app.shortDescription.toLowerCase().includes(currentSearch) ||
      app.developer.toLowerCase().includes(currentSearch) ||
      (app.tags || []).some((t) => t.toLowerCase().includes(currentSearch));
    return matchCat && matchSearch;
  });
}

function renderApps() {
  const grid = $("#appsGrid");
  const empty = $("#emptyState");
  const title = $("#sectionTitle");
  const countEl = $("#appCount");

  const apps = getFilteredApps();

  title.textContent = currentCategory === "All" ? "All Apps" : currentCategory;
  countEl.textContent = `${apps.length} app${apps.length !== 1 ? "s" : ""}`;

  grid.innerHTML = "";

  if (apps.length === 0) {
    empty.hidden = false;
    return;
  }
  empty.hidden = true;

  apps.forEach((app) => {
    const card = document.createElement("article");
    card.className = "app-card";
    card.innerHTML = `
      <div class="app-card-top">
        <img class="app-icon" src="${app.icon}" alt="${app.name}" loading="lazy" />
        <div class="app-card-info">
          <h3>${escapeHtml(app.name)}</h3>
          <div class="dev">${escapeHtml(app.developer)}</div>
          <div class="short">${escapeHtml(app.shortDescription)}</div>
        </div>
      </div>
      <div class="app-card-bottom">
        <div class="app-card-meta">
          <span class="rating">★ ${app.rating}</span>
          <span>${app.downloads}</span>
        </div>
        <a class="download-btn" href="${app.downloadUrl}" target="_blank" rel="noopener" onclick="event.stopPropagation()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          Download
        </a>
      </div>
    `;
    card.addEventListener("click", (e) => {
      if (!e.target.closest(".download-btn")) openModal(app);
    });
    grid.appendChild(card);
  });
}

function openModal(app) {
  const body = $("#modalBody");
  body.innerHTML = `
    <div class="modal-header">
      <img class="app-icon" src="${app.icon}" alt="${app.name}" />
      <div class="modal-header-info">
        <h2>${escapeHtml(app.name)}</h2>
        <div class="dev">${escapeHtml(app.developer)} · ${escapeHtml(app.category)}</div>
        <div class="modal-stats">
          <div><strong>★ ${app.rating}</strong> (${app.reviewsCount} reviews)</div>
          <div><strong>${app.downloads}</strong> downloads</div>
        </div>
      </div>
    </div>

    <div class="modal-actions">
      <a class="download-btn" href="${app.downloadUrl}" target="_blank" rel="noopener">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="18" height="18"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
        Download from GitHub
      </a>
      ${app.githubUrl ? `<a class="github-btn" href="${app.githubUrl}" target="_blank" rel="noopener">View Repo</a>` : ""}
    </div>

    ${
      app.screenshots && app.screenshots.length
        ? `<div class="screenshots">${app.screenshots
            .map((src) => `<img src="${src}" alt="Screenshot" loading="lazy" />`)
            .join("")}</div>`
        : ""
    }

    <div class="modal-section">
      <h3>About this app</h3>
      <p>${escapeHtml(app.description)}</p>
    </div>

    ${
      app.whatsNew
        ? `<div class="modal-section">
            <h3>What's new</h3>
            <pre>${escapeHtml(app.whatsNew)}</pre>
          </div>`
        : ""
    }

    <div class="modal-section">
      <h3>Information</h3>
      <div class="meta-grid">
        <div class="meta-item"><span>Version</span><strong>${escapeHtml(app.version || "—")}</strong></div>
        <div class="meta-item"><span>Size</span><strong>${escapeHtml(app.size || "—")}</strong></div>
        <div class="meta-item"><span>Updated</span><strong>${escapeHtml(app.updated || "—")}</strong></div>
        <div class="meta-item"><span>Requires</span><strong>${escapeHtml(app.requires || "—")}</strong></div>
      </div>
    </div>

    ${
      app.tags && app.tags.length
        ? `<div class="modal-section">
            <h3>Tags</h3>
            <div class="tags">${app.tags.map((t) => `<span class="tag">${escapeHtml(t)}</span>`).join("")}</div>
          </div>`
        : ""
    }
  `;

  $("#modalOverlay").hidden = false;
  document.body.style.overflow = "hidden";
}

function closeModal() {
  $("#modalOverlay").hidden = true;
  document.body.style.overflow = "";
}

function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function showToast(msg) {
  const toast = $("#toast");
  toast.textContent = msg;
  toast.hidden = false;
  setTimeout(() => {
    toast.hidden = true;
  }, 2800);
}

function loadTheme() {
  const saved = localStorage.getItem("appstore-theme");
  if (saved) {
    document.documentElement.setAttribute("data-theme", saved);
  } else if (window.matchMedia("(prefers-color-scheme: light)").matches) {
    document.documentElement.setAttribute("data-theme", "light");
  } else {
    document.documentElement.setAttribute("data-theme", "dark");
  }
}

function toggleTheme() {
  const current = document.documentElement.getAttribute("data-theme") || "dark";
  const next = current === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", next);
  localStorage.setItem("appstore-theme", next);
}

// Start
init();
