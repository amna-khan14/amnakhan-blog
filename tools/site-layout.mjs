/**
 * Shared sidebar icons and shell fragments.
 */
export const NAV_ITEMS = [
  { id: "home", label: "Home", href: "index.html", icon: "home" },
  { id: "categories", label: "Categories", href: "categories.html", icon: "folder" },
  { id: "tags", label: "Tags", href: "tags.html", icon: "tag" },
  { id: "archives", label: "Archives", href: "archives.html", icon: "archive" },
  { id: "about", label: "About", href: "index.html#about", icon: "user" },
];

export function escapeHtml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function renderHead({ title, description, root }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}" />
  <link rel="stylesheet" href="${root}style.css" />
</head>`;
}

function navIcon(name) {
  const icons = {
    home: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5Z" fill="currentColor"/></svg>',
    folder: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7Z" fill="currentColor"/></svg>',
    tag: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 12.5 11.2 4.3a1 1 0 0 1 1.4 0l6.9 6.9a1 1 0 0 1 0 1.4L11.2 20.7a1 1 0 0 1-1.4 0L3 13.9a1.5 1.5 0 0 1 0-1.4Z" fill="currentColor"/></svg>',
    archive: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h16v3H4V5Zm0 5h16l-1 9H5l-1-9Zm4 3v2h8v-2H8Z" fill="currentColor"/></svg>',
    user: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm-7 8a7 7 0 0 1 14 0H5Z" fill="currentColor"/></svg>',
  };
  return icons[name] || "";
}

export function renderBodyOpen({ root, activeNav = "", pageId = "" }) {
  const navLinks = NAV_ITEMS.map(
    (item) =>
      `<a href="${root}${item.href.replace(/^\//, "")}" class="sidebar-link${activeNav === item.id ? " is-active" : ""}">
        <span class="sidebar-link-icon">${navIcon(item.icon)}</span>
        <span>${item.label}</span>
      </a>`
  ).join("\n        ");

  const pageAttr = pageId ? ` data-page="${pageId}"` : "";

  return `<body data-root="${root}"${pageAttr}>
  <a class="skip-link" href="#mainContent">Skip to main content</a>
  <button class="sidebar-toggle" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="siteSidebar">
    <span></span><span></span><span></span>
  </button>
  <div class="sidebar-backdrop" id="sidebarBackdrop" hidden aria-hidden="true"></div>

  <aside class="sidebar" id="siteSidebar" aria-label="Site navigation">
    <div class="sidebar-profile">
      <div class="avatar" aria-hidden="true">AK</div>
      <a href="${root}index.html" class="sidebar-name">Amna Khan</a>
      <p class="sidebar-role">Computer Engineering Student</p>
      <p class="sidebar-campus">UET Lahore, Faisalabad Campus</p>
    </div>
    <nav class="sidebar-nav" id="mainNav" aria-label="Primary">
      ${navLinks}
    </nav>
    <div class="sidebar-social">
      <a href="https://github.com/amna-khan14" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a10 10 0 0 0-3.16 19.49c.5.1.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.15-1.11-1.46-1.11-1.46-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.36 1.09 2.93.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.1.39-1.99 1.03-2.69a3.6 3.6 0 0 1 .1-2.64s.84-.27 2.75 1.02a9.58 9.58 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.37.94.58 1.94.58 2.96 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.18.59.69.48A10 10 0 0 0 12 2Z" fill="currentColor"/></svg>
      </a>
      <a href="mailto:amnakhan.dev123@gmail.com" aria-label="Email">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Zm0 2 8 5 8-5" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>
      </a>
    </div>
  </aside>

  <div class="site-main">
    <div class="content-area">
      <main class="content-main" id="mainContent">`;
}

export function renderPageHeader({ breadcrumb, titleHtml, metaHtml = "" }) {
  return `<header class="page-header">
        ${breadcrumb}
        <div class="page-title-block">
          ${titleHtml}
          ${metaHtml}
        </div>
      </header>`;
}

export function renderRightPanel({ root }) {
  return `      </main>

      <aside class="panel-right" aria-label="Blog sidebar">
        <form class="panel-search" action="${root}archives.html" method="get" role="search">
          <label class="visually-hidden" for="panelSearch">Search posts</label>
          <span class="panel-search-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" stroke-width="2"/><path d="m20 20-3.5-3.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
          </span>
          <input id="panelSearch" type="search" name="q" placeholder="Search posts…" autocomplete="off" />
        </form>
        <section class="panel-block panel-block--lined">
          <h2 class="panel-title">Recently Updated</h2>
          <ul class="recent-list recent-list--panel" data-recent-posts aria-live="polite">
            <li class="recent-item" data-blog-loading>Loading…</li>
          </ul>
        </section>
        <section class="panel-block panel-block--lined">
          <h2 class="panel-title">Trending Tags</h2>
          <div class="tag-cloud tag-cloud--panel" data-trending-tags aria-live="polite">
            <span data-blog-loading>Loading…</span>
          </div>
        </section>
      </aside>
    </div>`;
}

export function renderFooter({ root }) {
  return `
    <footer class="site-footer">
      <div class="footer-inner">
        <p>© 2026 Amna Khan. University lab blog project.</p>
      </div>
    </footer>
  </div>

  <script src="${root}script.js"></script>
  <script src="${root}js/blog.js"></script>
</body>
</html>`;
}
