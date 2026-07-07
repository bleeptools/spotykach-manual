// ---------------------------------------------------------------------------
// SPOTYKACH MANUAL — APP LOGIC
// ---------------------------------------------------------------------------
// Hash-based routes:
//   #/                     home (entry points + search)
//   #/topic/<id>            a single control-in-mode topic
//   #/control/<id>           control overview (all modes for one control)
//   #/mode/<id>              mode overview (all controls in one mode)
//   #/concept/<id>           a concept topic
//   #/page/<id>              a long-form, non-mode-specific manual section
// ---------------------------------------------------------------------------

const { MODES, CONTROLS, CONCEPTS, PAGES, TOPICS } = window.SPOTYKACH_DATA;

const byId = (list) => Object.fromEntries(list.map((x) => [x.id, x]));
const modesById = byId(MODES);
const controlsById = byId(CONTROLS);
const conceptsById = byId(CONCEPTS);
const pagesById = byId(PAGES);
const topicsById = byId(TOPICS);

// ---- Reverse-edge index: build "referenced by" for every concept/topic ----
// This is the mechanism that makes every link bidirectional automatically —
// authors in data.js only ever write the forward edge.
const backlinks = {}; // targetId -> [{ from: topicId, type }]
for (const topic of TOPICS) {
  for (const rel of topic.relations || []) {
    (backlinks[rel.target] ||= []).push({ from: topic.id, type: rel.type });
  }
}

function relTypeLabel(type) {
  return { "references-concept": "References", "related-topic": "Related" }[type] || type;
}

// Resolve a relation target across every kind of thing it could point at.
// Every referenceable record (topic, concept, page) exposes `.title`.
function resolveRef(id) {
  if (topicsById[id]) return { kind: "topic", item: topicsById[id] };
  if (conceptsById[id]) return { kind: "concept", item: conceptsById[id] };
  if (pagesById[id]) return { kind: "page", item: pagesById[id] };
  return null;
}
function hrefFor(kind, id) {
  return `#/${kind}/${id}`;
}

function topicsForControl(controlId) {
  return TOPICS.filter((t) => t.facets.control === controlId)
    .sort((a, b) => MODES.findIndex(m => m.id === a.facets.mode) - MODES.findIndex(m => m.id === b.facets.mode));
}

function topicsForMode(modeId) {
  return TOPICS.filter((t) => t.facets.mode === modeId)
    .sort((a, b) => controlsById[a.facets.control].order - controlsById[b.facets.control].order);
}

// ---- Rendering helpers ----
const app = document.getElementById("app");
const esc = (s) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

function link(href, label, extraClass = "") {
  return `<a href="${href}" class="pill ${extraClass}">${esc(label)}</a>`;
}

function modeRail(currentModeId, controlId) {
  const items = MODES.map((m) => {
    const targetId = `${controlId}_${m.id}`;
    const exists = topicsById[targetId];
    const active = m.id === currentModeId;
    if (!exists) return `<span class="pill pill-disabled" title="No ${esc(m.label)} behavior recorded">${esc(m.label)}</span>`;
    return link(`#/topic/${targetId}`, m.label, active ? "pill-active" : "");
  }).join("");
  return `<nav class="rail rail-modes" aria-label="Switch mode"><span class="rail-label">Mode</span>${items}</nav>`;
}

function controlRail(currentControlId, modeId) {
  const items = CONTROLS.map((c) => {
    const targetId = `${c.id}_${modeId}`;
    const exists = topicsById[targetId];
    const active = c.id === currentControlId;
    if (!exists) return "";
    return `<li>${link(`#/topic/${targetId}`, c.label, active ? "pill-active" : "")}</li>`;
  }).join("");
  return `<nav class="rail rail-controls" aria-label="Switch control"><span class="rail-label">${esc(modesById[modeId].label)} mode</span><ul>${items}</ul></nav>`;
}

function relatedPanel(topic) {
  const rows = [];
  for (const rel of topic.relations || []) {
    const ref = resolveRef(rel.target);
    if (!ref) continue;
    rows.push(`<li>${relTypeLabel(rel.type)}: ${link(hrefFor(ref.kind, rel.target), ref.item.title)}</li>`);
  }
  const back = (backlinks[topic.id] || []).map((b) => topicsById[b.from]).filter(Boolean);
  for (const src of back) {
    rows.push(`<li>Referenced from: ${link(`#/topic/${src.id}`, src.title)}</li>`);
  }
  if (!rows.length) return "";
  return `<section class="related"><h3>Related</h3><ul>${rows.join("")}</ul></section>`;
}

// ---- Views ----
function renderHome() {
  const bySection = {};
  for (const p of PAGES) (bySection[p.section] ||= []).push(p);

  app.innerHTML = `
    <header class="hero">
      <p class="kicker">Spotykach</p>
      <h1>Interactive manual</h1>
      <p>Two ways into the deck controls: pick a knob or pad to see it across every mode, or pick a mode to see everything it controls. Everything else — routing, storage, MIDI — lives in the manual sections below.</p>
      <input id="search" class="search" type="search" placeholder="Search the manual…" aria-label="Search the manual" />
      <div id="search-results"></div>
    </header>

    <section class="sections-block">
      <h2>Manual sections</h2>
      <div class="sections-grid">
        ${Object.entries(bySection).map(([section, pages]) => `
          <div class="section-group">
            <h3>${esc(section)}</h3>
            <ul class="entry-list">
              ${pages.map((p) => `<li>${link(`#/page/${p.id}`, p.title)}${p.dek ? `<span class="hint">${esc(p.dek)}</span>` : ""}</li>`).join("")}
            </ul>
          </div>`).join("")}
      </div>
    </section>

    <section class="entry-grid">
      <div class="entry-col">
        <h2>Browse by control</h2>
        <ul class="entry-list">
          ${CONTROLS.map((c) => `<li>${link(`#/control/${c.id}`, c.label)}</li>`).join("")}
        </ul>
      </div>
      <div class="entry-col">
        <h2>Browse by mode</h2>
        <ul class="entry-list">
          ${MODES.map((m) => `<li>${link(`#/mode/${m.id}`, m.label)}<span class="hint">${esc(m.blurb)}</span></li>`).join("")}
        </ul>
      </div>
      <div class="entry-col">
        <h2>Concepts</h2>
        <ul class="entry-list">
          ${CONCEPTS.map((c) => `<li>${link(`#/concept/${c.id}`, c.title)}</li>`).join("")}
        </ul>
      </div>
    </section>`;

  const searchBox = document.getElementById("search");
  const results = document.getElementById("search-results");
  searchBox.addEventListener("input", () => {
    const q = searchBox.value.trim().toLowerCase();
    if (!q) { results.innerHTML = ""; return; }
    const hits = [
      ...PAGES.filter((p) => p.title.toLowerCase().includes(q) || (p.dek || "").toLowerCase().includes(q))
        .map((p) => ({ href: `#/page/${p.id}`, label: p.title })),
      ...CONTROLS.filter((c) => c.label.toLowerCase().includes(q))
        .map((c) => ({ href: `#/control/${c.id}`, label: `${c.label} — all modes` })),
      ...MODES.filter((m) => m.label.toLowerCase().includes(q))
        .map((m) => ({ href: `#/mode/${m.id}`, label: `${m.label} mode` })),
      ...TOPICS.filter((t) => t.title.toLowerCase().includes(q)).map((t) => ({ href: `#/topic/${t.id}`, label: t.title })),
      ...CONCEPTS.filter((c) => c.title.toLowerCase().includes(q)).map((c) => ({ href: `#/concept/${c.id}`, label: c.title })),
    ].slice(0, 10);
    results.innerHTML = hits.length
      ? `<ul class="search-hits">${hits.map((h) => `<li>${link(h.href, h.label)}</li>`).join("")}</ul>`
      : `<p class="hint">No matches.</p>`;
  });
}

function renderTopic(id) {
  const topic = topicsById[id];
  if (!topic) return renderNotFound(id);
  const { mode, control } = topic.facets;
  app.innerHTML = `
    <a class="back" href="#/">&larr; Home</a>
    ${modeRail(mode, control)}
    <div class="topic-layout">
      ${controlRail(control, mode)}
      <article class="focused">
        <h1>${esc(topic.title)}</h1>
        <p>${esc(topic.body)}</p>
        ${relatedPanel(topic)}
      </article>
    </div>`;
}

function renderControlOverview(id) {
  const control = controlsById[id];
  if (!control) return renderNotFound(id);
  const rows = topicsForControl(id);
  app.innerHTML = `
    <a class="back" href="#/">&larr; Home</a>
    <h1>${esc(control.label)} — across modes</h1>
    <p class="hint">Every mode's behavior for this one control.</p>
    <div class="overview-grid">
      ${rows.map((t) => `
        <div class="overview-card">
          <h3>${link(`#/topic/${t.id}`, modesById[t.facets.mode].label)}</h3>
          <p>${esc(t.body)}</p>
        </div>`).join("")}
    </div>`;
}

function renderModeOverview(id) {
  const mode = modesById[id];
  if (!mode) return renderNotFound(id);
  const rows = topicsForMode(id);
  app.innerHTML = `
    <a class="back" href="#/">&larr; Home</a>
    <h1>${esc(mode.label)} mode — all controls</h1>
    <p class="hint">${esc(mode.blurb)}</p>
    <div class="overview-grid">
      ${rows.map((t) => `
        <div class="overview-card">
          <h3>${link(`#/topic/${t.id}`, controlsById[t.facets.control].label)}</h3>
          <p>${esc(t.body)}</p>
        </div>`).join("")}
    </div>`;
}

function renderConcept(id) {
  const concept = conceptsById[id];
  if (!concept) return renderNotFound(id);
  const back = (backlinks[id] || []).map((b) => topicsById[b.from]).filter(Boolean);
  app.innerHTML = `
    <a class="back" href="#/">&larr; Home</a>
    <article class="focused">
      <h1>${esc(concept.title)}</h1>
      <p>${esc(concept.body)}</p>
      ${back.length ? `<section class="related"><h3>Used in</h3><ul>${back.map((t) => `<li>${link(`#/topic/${t.id}`, t.title)}</li>`).join("")}</ul></section>` : ""}
    </article>`;
}

function renderPage(id) {
  const page = pagesById[id];
  if (!page) return renderNotFound(id);
  app.innerHTML = `
    <a class="back" href="#/">&larr; Home</a>
    <article class="focused page">
      <p class="kicker">${esc(page.section)}</p>
      <h1>${esc(page.title)}</h1>
      ${page.dek ? `<p class="dek">${esc(page.dek)}</p>` : ""}
      <div class="page-body">${page.body}</div>
    </article>`;
}

function renderNotFound(id) {
  app.innerHTML = `<a class="back" href="#/">&larr; Home</a><p>No entry found for "${esc(id)}".</p>`;
}

// ---- Router ----
function route() {
  const hash = location.hash.replace(/^#\/?/, "");
  const [kind, id] = hash.split("/");
  window.scrollTo(0, 0);
  if (!kind) return renderHome();
  if (kind === "topic") return renderTopic(id);
  if (kind === "control") return renderControlOverview(id);
  if (kind === "mode") return renderModeOverview(id);
  if (kind === "concept") return renderConcept(id);
  if (kind === "page") return renderPage(id);
  return renderNotFound(hash);
}

window.addEventListener("hashchange", route);
window.addEventListener("DOMContentLoaded", route);
