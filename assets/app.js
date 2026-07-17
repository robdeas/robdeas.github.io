let posts = [];
let pages = [];
let articles = [];
const app = document.querySelector("#app");

const escapeHtml = (value = "") => value
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;");

const displayDate = (value) => {
  if (!value) return "";
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" }).format(new Date(`${value}T12:00:00`));
};

let allCategories = [];
let heroPost = null;
let activeCategory = "All";

function card(post) {
  const image = post.hero ? `<div class="thumb"><img src="${post.hero}" alt=""></div>` : `<div class="thumb" aria-hidden="true"></div>`;
  const cats = (post.categories || []).slice(0, 3).map((cat) => `<span class="chip">${escapeHtml(cat)}</span>`).join("");
  return `
    <a class="card" href="#/${post.slug}">
      ${image}
      <div class="card-body">
        <div class="meta">${post.type === "page" ? "Page" : displayDate(post.date)}</div>
        <h3>${escapeHtml(post.title)}</h3>
        <p>${escapeHtml(post.excerpt || "")}</p>
        <div class="chips">${cats}</div>
      </div>
    </a>
  `;
}

function renderHome() {
  const featured = articles.slice(0, 6);
  const projectLike = articles.filter((post) => /project|robokey|shellguard|sheaf|puzzle|coroutine|verzanctuary/i.test(`${post.title} ${(post.categories || []).join(" ")}`)).slice(0, 6);
  app.innerHTML = `
    <section class="hero">
      <div>
        <div class="eyebrow">Software engineering notebook</div>
        <h1>Practical notes from software projects, tools, and experiments.</h1>
        <p>Robs Software Engineering Notebook collects articles, project write-ups, and engineering ideas from robd.tech in a cleaner static format.</p>
        <div class="hero-actions">
          <a class="button primary" href="#/articles">Browse articles</a>
          <a class="button" href="#/projects">View projects</a>
        </div>
      </div>
      <div class="hero-media">
        ${heroPost?.hero ? `<img src="${heroPost.hero}" alt="">` : ""}
      </div>
    </section>
    <section class="section">
      <div class="section-head">
        <div>
          <h2>Writing</h2>
          <p>Posts imported from the WordPress site, with local media links preserved.</p>
        </div>
        <a class="button" href="#/articles">View all</a>
      </div>
      <div class="grid">${featured.map(card).join("")}</div>
    </section>
    <section class="section">
      <div class="section-head">
        <div>
          <h2>Projects</h2>
          <p>Tools, libraries, experiments, and build notes gathered into a more browsable static surface.</p>
        </div>
        <a class="button" href="#/projects">More projects</a>
      </div>
      <div class="grid">${projectLike.map(card).join("")}</div>
    </section>
  `;
}

function renderListing(mode = "articles") {
  const isProjects = mode === "projects";
  const base = isProjects
    ? articles.filter((post) => /project|robokey|shellguard|sheaf|puzzle|coroutine|verzanctuary|keyboard|library|tool/i.test(`${post.title} ${post.excerpt} ${(post.categories || []).join(" ")}`))
    : articles;

  app.innerHTML = `
    <section class="section">
      <div class="section-head">
        <div>
          <div class="eyebrow">${isProjects ? "Projects" : "Articles"}</div>
          <h2>${isProjects ? "Project Notes" : "All Writing"}</h2>
          <p>${isProjects ? "A focused slice of tools, libraries, and experiments from the site." : "Search and filter the imported writing from the WordPress site."}</p>
        </div>
      </div>
      <div class="toolbar">
        <input class="search" id="search" type="search" placeholder="Search titles, excerpts, categories">
        <div class="filters" id="filters">
          <button class="filter active" type="button" data-category="All">All</button>
          ${allCategories.slice(0, 10).map((cat) => `<button class="filter" type="button" data-category="${escapeHtml(cat)}">${escapeHtml(cat)}</button>`).join("")}
        </div>
      </div>
      <div class="grid" id="listing"></div>
    </section>
  `;

  const listing = document.querySelector("#listing");
  const search = document.querySelector("#search");
  const filters = document.querySelector("#filters");

  function paint() {
    const query = search.value.trim().toLowerCase();
    const filtered = base.filter((post) => {
      const haystack = `${post.title} ${post.excerpt} ${(post.categories || []).join(" ")}`.toLowerCase();
      const categoryMatch = activeCategory === "All" || (post.categories || []).includes(activeCategory);
      return categoryMatch && (!query || haystack.includes(query));
    });
    listing.innerHTML = filtered.length ? filtered.map(card).join("") : `<div class="empty">No matching posts found.</div>`;
  }

  search.addEventListener("input", paint);
  filters.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-category]");
    if (!button) return;
    activeCategory = button.dataset.category;
    filters.querySelectorAll(".filter").forEach((item) => item.classList.toggle("active", item === button));
    paint();
  });

  paint();
}

function renderArticle(slug) {
  const post = posts.find((item) => item.slug === slug);
  if (!post) {
    app.innerHTML = `<section class="article-shell"><div class="empty">That page was not found. <a href="#/articles">Browse the archive</a>.</div></section>`;
    return;
  }
  const cats = (post.categories || []).map((cat) => `<span class="chip">${escapeHtml(cat)}</span>`).join("");
  app.innerHTML = `
    <article class="article article-shell">
      <a class="button" href="#/articles">Back to archive</a>
      <div class="meta" style="margin-top:24px">${post.type === "page" ? "Page" : displayDate(post.date)}</div>
      <h1>${escapeHtml(post.title)}</h1>
      <div class="chips">${cats}</div>
      ${post.hero ? `<img class="article-hero-image" src="${post.hero}" alt="">` : ""}
      <div class="article-content">${post.content}</div>
    </article>
  `;
}

function route() {
  const slug = location.hash.replace(/^#\/?/, "").replace(/\/$/, "");
  activeCategory = "All";
  if (!slug || slug === "home") renderHome();
  else if (slug === "articles" || slug === "blog" || slug === "contents" || slug === "categories") renderListing("articles");
  else if (slug === "projects" || slug === "my-portfolio") renderListing("projects");
  else renderArticle(slug);
  window.scrollTo({ top: 0, behavior: "instant" });
  app.focus({ preventScroll: true });
}

window.addEventListener("hashchange", route);

async function init() {
  try {
    const response = await fetch("content.json");
    if (!response.ok) throw new Error(`Could not load content.json: ${response.status}`);
    posts = await response.json();
    pages = posts.filter((post) => post.type === "page");
    articles = posts.filter((post) => post.type === "post");
    allCategories = [...new Set(articles.flatMap((post) => post.categories || []))]
      .sort((a, b) => a.localeCompare(b));
    heroPost = articles.find((post) => post.hero) || articles[0] || null;
    route();
  } catch (error) {
    app.innerHTML = `<section class="article-shell"><div class="empty">The site content could not be loaded. If you opened this file directly, try serving the folder with a local static server.</div></section>`;
    console.error(error);
  }
}

init();