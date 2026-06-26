/**
 * Generates page shells with shared sidebar from site-layout.mjs
 * Run: node tools/build-pages.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {
  renderBodyOpen,
  renderFooter,
  renderHead,
  renderPageHeader,
  renderRightPanel,
} from "./site-layout.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const ROOT = "";

function crumb(items) {
  const parts = items
    .map((item) => {
      if (item.href) {
        const attrs = item.dataAttr ? ` ${item.dataAttr}` : "";
        return `<a href="${item.href}"${attrs}>${item.label}</a>`;
      }
      const attrs = item.dataAttr ? ` ${item.dataAttr}` : "";
      return `<span${attrs}>${item.label}</span>`;
    })
    .join('<span aria-hidden="true">/</span>');

  return `<nav class="top-breadcrumb" aria-label="Breadcrumb"><a href="index.html">Home</a><span aria-hidden="true">/</span>${parts}</nav>`;
}

const pages = [
  {
    file: "categories.html",
    title: "Categories | Amna Khan Blog",
    description: "Browse blog posts by category folder.",
    activeNav: "categories",
    pageId: "categories",
    header: renderPageHeader({
      breadcrumb: crumb([{ label: "Categories" }]),
      titleHtml: "<h1>Categories</h1>",
      metaHtml: "<p>Browse posts by semester folder and topic</p>",
    }),
    main: `<div class="categories-page" data-categories-list aria-live="polite"><p data-blog-loading>Loading categories…</p></div>`,
  },
  {
    file: "category.html",
    title: "Category | Amna Khan Blog",
    description: "Posts in this category.",
    activeNav: "categories",
    pageId: "category",
    header: renderPageHeader({
      breadcrumb: crumb([
        { label: "Categories", href: "categories.html" },
        { label: "Folder", href: "categories.html", dataAttr: 'data-crumb-parent' },
        { label: "Category", dataAttr: 'data-crumb-category' },
      ]),
      titleHtml: "<h1 data-category-title>Category</h1>",
      metaHtml: "<p data-category-meta>Loading…</p>",
    }),
    main: `<ul class="post-link-list" data-category-posts aria-live="polite"><li data-blog-loading>Loading posts…</li></ul>`,
  },
  {
    file: "tags.html",
    title: "Tags | Amna Khan Blog",
    description: "Browse blog posts by tag.",
    activeNav: "tags",
    pageId: "tags",
    header: renderPageHeader({
      breadcrumb: crumb([{ label: "Tags" }]),
      titleHtml: "<h1>Tags</h1>",
      metaHtml: "<p>Find posts by topic and keyword</p>",
    }),
    main: `<div class="tags-page-grid" data-tags-list aria-live="polite"><p data-blog-loading>Loading tags…</p></div>`,
  },
  {
    file: "tag.html",
    title: "Tag | Amna Khan Blog",
    description: "Posts with this tag.",
    activeNav: "tags",
    pageId: "tag",
    header: renderPageHeader({
      breadcrumb: crumb([
        { label: "Tags", href: "tags.html" },
        { label: "Tag", dataAttr: 'data-crumb-tag' },
      ]),
      titleHtml: '<h1><span class="tag-page-label">Tag:</span> <span data-tag-title>…</span></h1>',
      metaHtml: "<p data-tag-meta>Loading…</p>",
    }),
    main: `<ul class="post-link-list" data-tag-posts aria-live="polite"><li data-blog-loading>Loading posts…</li></ul>`,
  },
  {
    file: "archives.html",
    title: "Archives | Amna Khan Blog",
    description: "Timeline of all blog posts.",
    activeNav: "archives",
    pageId: "archives",
    header: renderPageHeader({
      breadcrumb: crumb([{ label: "Archives" }]),
      titleHtml: "<h1>Archives</h1>",
      metaHtml: "<p>Full timeline of all blog posts</p>",
    }),
    main: `
        <div class="filter-banner" data-filter-banner hidden></div>
        <div class="archives-toolbar-wrap">
          <label class="search-field" for="blogSearch">
            <span class="search-label">Filter timeline</span>
            <input id="blogSearch" type="search" data-blog-search placeholder="Type to filter posts…" autocomplete="off" />
          </label>
          <p class="search-status" data-search-status aria-live="polite"></p>
        </div>
        <div class="archives-timeline-wrap" data-archives-timeline aria-live="polite"><p data-blog-loading>Loading timeline…</p></div>`,
  },
];

for (const page of pages) {
  const html = `${renderHead({ title: page.title, description: page.description, root: ROOT })}
${renderBodyOpen({ root: ROOT, activeNav: page.activeNav, pageId: page.pageId })}
        ${page.header}
        ${page.main}
${renderRightPanel({ root: ROOT })}
${renderFooter({ root: ROOT })}`;

  fs.writeFileSync(path.join(root, page.file), html, "utf8");
  console.log(`Built ${page.file}`);
}

console.log("Page shells updated.");
