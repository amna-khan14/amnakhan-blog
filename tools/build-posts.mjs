/**
 * Generates static post HTML files from data/posts.json and data/post-bodies.json.
 * Run: node tools/build-posts.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {
  escapeHtml,
  renderBodyOpen,
  renderFooter,
  renderHead,
  renderRightPanel,
} from "./site-layout.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const postsData = JSON.parse(fs.readFileSync(path.join(root, "data/posts.json"), "utf8"));
const bodies = JSON.parse(fs.readFileSync(path.join(root, "data/post-bodies.json"), "utf8"));

const { site, categories, posts } = postsData;
const categoryById = Object.fromEntries(categories.map((c) => [c.id, c]));
const postById = Object.fromEntries(posts.map((p) => [p.id, p]));
const ROOT = "../../";

function formatDate(iso) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function renderSections(sections) {
  return sections
    .map(
      (section) => `
        <h2>${escapeHtml(section.heading)}</h2>
        ${section.paragraphs.map((p) => `<p>${escapeHtml(p)}</p>`).join("\n        ")}`
    )
    .join("\n");
}

function renderRelated(relatedIds) {
  const links = relatedIds
    .map((id) => postById[id])
    .filter(Boolean)
    .map((p) => {
      const cat = categoryById[p.category];
      const href = `${ROOT}posts/${cat.folder}/${p.file}`;
      return `<a href="${href}">${escapeHtml(p.title)}</a>`;
    });

  if (!links.length) return "";

  return `
        <section class="related-posts">
          <h3>Related Posts</h3>
          <div class="related-links">${links.join("\n          ")}</div>
        </section>`;
}

function renderPostPage(post) {
  const category = categoryById[post.category];
  const body = bodies[post.slug];
  if (!body) throw new Error(`Missing body content for slug: ${post.slug}`);

  const tagLinks = post.tags
    .map(
      (tag) =>
        `<a class="tag-chip" href="${ROOT}tag.html#${encodeURIComponent(tag)}">${escapeHtml(tag)}</a>`
    )
    .join("\n            ");

  const theme = category.theme || "default";

  return `${renderHead({
    title: `${post.title} | ${site.title}`,
    description: post.excerpt,
    root: ROOT,
  })}
${renderBodyOpen({ root: ROOT, activeNav: "", pageId: "post" })}
        <nav class="top-breadcrumb" aria-label="Breadcrumb">
          <a href="${ROOT}index.html">Home</a>
          <span aria-hidden="true">/</span>
          <a href="${ROOT}categories.html">Categories</a>
          <span aria-hidden="true">/</span>
          <a href="${ROOT}category.html#${category.slug}">${escapeHtml(category.shortName || category.name)}</a>
          <span aria-hidden="true">/</span>
          <span>${escapeHtml(post.title)}</span>
        </nav>

        <article class="article-page">
          <div class="post-hero post-hero--${theme}" aria-hidden="true"></div>
          <header class="article-header">
            <span class="badge">${escapeHtml(category.name)}</span>
            <h1>${escapeHtml(post.title)}</h1>
            <p class="article-meta">By ${escapeHtml(site.author)} • ${formatDate(post.published)} • ${post.readTime} min read</p>
            <p class="article-intro">${escapeHtml(body.intro)}</p>
            <div class="tag-list">${tagLinks}</div>
          </header>

          <div class="article-content">
            ${renderSections(body.sections)}
          </div>
          ${renderRelated(post.related || [])}
        </article>
${renderRightPanel({ root: ROOT })}
${renderFooter({ root: ROOT })}`;
}

let generated = 0;

for (const post of posts) {
  const category = categoryById[post.category];
  const dir = path.join(root, "posts", category.folder);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, post.file), renderPostPage(post), "utf8");
  generated += 1;
  console.log(`Generated: posts/${category.folder}/${post.file}`);
}

console.log(`\nDone. ${generated} post pages generated.`);
