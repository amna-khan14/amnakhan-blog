/**
 * Blog listing, search, categories, tags, and archives.
 */
(function () {
  let blogData = null;

  const qs = (sel, root = document) => root.querySelector(sel);
  const qsa = (sel, root = document) => [...root.querySelectorAll(sel)];

  function getRoot() {
    const root = document.body?.dataset.root ?? "";
    return root.endsWith("/") ? root : root ? `${root}/` : "";
  }

  function asset(path) {
    return `${getRoot()}${path.replace(/^\//, "")}`;
  }

  function pageUrl(page, params = "") {
    return `${asset(page)}${params}`;
  }

  function categoryPageUrl(slug) {
    return `${asset("category.html")}#${encodeURIComponent(slug)}`;
  }

  function tagPageUrl(tag) {
    return `${asset("tag.html")}#${encodeURIComponent(tag)}`;
  }

  function readHashParam() {
    const raw = window.location.hash.replace(/^#/, "");
    return raw ? decodeURIComponent(raw) : "";
  }

  function formatDate(iso) {
    const d = new Date(iso + "T00:00:00");
    return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  }

  function formatArchiveDate(iso) {
    const d = new Date(iso + "T00:00:00");
    const day = d.toLocaleDateString("en-GB", { day: "2-digit" });
    const month = d.toLocaleDateString("en-GB", { month: "short" });
    return `${day} ${month}`;
  }

  function truncate(text, max = 48) {
    if (text.length <= max) return text;
    return `${text.slice(0, max).trim()}…`;
  }

  function getCategory(post) {
    return blogData.categories.find((c) => c.id === post.category);
  }

  function getParentFolder(category) {
    return blogData.parentFolders?.find((p) => p.id === category.parentId);
  }

  function postUrl(post) {
    const category = getCategory(post);
    return asset(`posts/${category.folder}/${post.file}`);
  }

  function sortPosts(list) {
    return [...list].sort((a, b) => new Date(b.published) - new Date(a.published));
  }

  function postSearchText(post) {
    const category = getCategory(post);
    return [post.title, post.excerpt, category.name, category.folder, ...(post.tags || [])]
      .join(" ")
      .toLowerCase();
  }

  async function loadBlogData() {
    if (blogData) return blogData;
    const response = await fetch(asset("data/posts.json"));
    if (!response.ok) throw new Error("Could not load blog data.");
    blogData = await response.json();
    return blogData;
  }

  function folderIconSvg() {
    return `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7Z" fill="currentColor"/></svg>`;
  }

  function renderTrendingTags(container, limit = 10) {
    if (!container || !blogData) return;
    const counts = {};
    blogData.posts.forEach((post) => {
      (post.tags || []).forEach((tag) => {
        counts[tag] = (counts[tag] || 0) + 1;
      });
    });

    container.innerHTML = Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([tag]) => `<a class="tag-chip" href="${tagPageUrl(tag)}">${tag}</a>`)
      .join("");
  }

  function renderRecentPosts(container, limit = 5) {
    if (!container) return;
    const isPanel = container.closest(".panel-right");

    container.innerHTML = sortPosts(blogData.posts)
      .slice(0, limit)
      .map((post) => {
        const title = isPanel ? truncate(post.title, 42) : post.title;
        return `
          <li class="recent-item">
            <a href="${postUrl(post)}" title="${post.title}">${title}</a>
            ${isPanel ? "" : `<span>${formatDate(post.published)}</span>`}
          </li>`;
      })
      .join("");
  }

  /** Categories: parent folder → click sub-folder → category.html */
  function renderCategoriesPage(container) {
    if (!container) return;

    const parents = blogData.parentFolders || [];

    container.innerHTML = parents
      .map((parent) => {
        const subs = blogData.categories.filter((c) => c.parentId === parent.id);
        const totalPosts = subs.reduce(
          (n, cat) => n + blogData.posts.filter((p) => p.category === cat.id).length,
          0
        );

        const subRows = subs
          .map((cat) => {
            const count = blogData.posts.filter((p) => p.category === cat.id).length;
            return `
              <li>
                <a class="subfolder-link" href="${categoryPageUrl(cat.slug)}">
                  <span class="subfolder-icon">${folderIconSvg()}</span>
                  <span class="subfolder-name">${cat.shortName || cat.name}</span>
                  <span class="subfolder-count">${count} post${count === 1 ? "" : "s"}</span>
                </a>
              </li>`;
          })
          .join("");

        return `
          <section class="folder-group open parent-folder" data-folder id="${parent.slug}">
            <button class="folder-head" type="button" aria-expanded="true">
              <span class="folder-icon">${folderIconSvg()}</span>
              <span class="folder-meta">
                <strong>${parent.label}</strong>
                <span>${subs.length} ${subs.length === 1 ? "category" : "categories"}, ${totalPosts} posts</span>
              </span>
              <span class="folder-chevron" aria-hidden="true"></span>
            </button>
            <div class="subfolder-list" role="region" aria-label="${parent.label} categories">
              <ul class="subfolder-list-inner">${subRows}</ul>
            </div>
          </section>`;
      })
      .join("");
  }

  /** category.html — list posts in one sub-folder */
  function renderCategoryPostsPage(container) {
    if (!container) return;

    const slug =
      new URLSearchParams(window.location.search).get("cat") || readHashParam();
    const category = blogData.categories.find((c) => c.slug === slug);

    if (!category) {
      container.innerHTML = `<p class="empty-result">Category not found. <a href="${pageUrl("categories.html")}">Back to categories</a></p>`;
      return;
    }

    const parent = getParentFolder(category);
    const posts = sortPosts(blogData.posts.filter((p) => p.category === category.id));

    const titleEl = qs("[data-category-title]");
    const metaEl = qs("[data-category-meta]");
    const crumbParent = qs("[data-crumb-parent]");
    const crumbCat = qs("[data-crumb-category]");

    if (titleEl) titleEl.textContent = category.name;
    if (metaEl) {
      metaEl.textContent = `${posts.length} post${posts.length === 1 ? "" : "s"} in ${category.shortName || category.name}`;
    }
    if (crumbParent && parent) {
      crumbParent.textContent = parent.label;
      crumbParent.href = `${pageUrl("categories.html")}#${parent.slug}`;
    }
    if (crumbCat) crumbCat.textContent = category.shortName || category.name;

    document.title = `${category.name} | Amna Khan Blog`;

    container.innerHTML = posts
      .map(
        (post) => `
        <li class="post-link-row">
          <time datetime="${post.published}">${formatDate(post.published)}</time>
          <a href="${postUrl(post)}">${post.title}</a>
          <span>${post.readTime} min read</span>
        </li>`
      )
      .join("");
  }

  /** tag.html — list posts for a tag */
  function renderTagPostsPage(container) {
    if (!container) return;

    const tag =
      new URLSearchParams(window.location.search).get("tag") || readHashParam();
    if (!tag) {
      container.innerHTML = `<p class="empty-result">No tag selected.</p>`;
      return;
    }

    const posts = sortPosts(blogData.posts.filter((p) => (p.tags || []).includes(tag)));

    const titleEl = qs("[data-tag-title]");
    const metaEl = qs("[data-tag-meta]");
    const crumbTag = qs("[data-crumb-tag]");

    if (titleEl) titleEl.textContent = tag;
    if (metaEl) metaEl.textContent = `${posts.length} post${posts.length === 1 ? "" : "s"} with this tag`;
    if (crumbTag) crumbTag.textContent = tag;
    document.title = `${tag} | Tags | Amna Khan Blog`;

    if (!posts.length) {
      container.innerHTML = `<p class="empty-result">No posts found for this tag.</p>`;
      return;
    }

    container.innerHTML = posts
      .map(
        (post) => `
        <li class="post-link-row">
          <time datetime="${post.published}">${formatDate(post.published)}</time>
          <a href="${postUrl(post)}">${post.title}</a>
          <span>${getCategory(post).shortName || getCategory(post).name}</span>
        </li>`
      )
      .join("");
  }

  function renderTagsPage(container) {
    if (!container) return;
    const counts = {};
    blogData.posts.forEach((post) => {
      (post.tags || []).forEach((t) => {
        counts[t] = (counts[t] || 0) + 1;
      });
    });

    container.innerHTML = Object.entries(counts)
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .map(
        ([t, count]) => `
          <a class="tag-card" href="${tagPageUrl(t)}">
            <strong>${t}</strong>
            <span>${count} post${count === 1 ? "" : "s"}</span>
          </a>`
      )
      .join("");
  }

  function renderArchivesTimeline(container, filter = {}) {
    if (!container) return;

    let posts = sortPosts(blogData.posts);

    if (filter.category) posts = posts.filter((p) => getCategory(p).slug === filter.category);
    if (filter.tag) posts = posts.filter((p) => (p.tags || []).includes(filter.tag));
    if (filter.query) {
      const q = filter.query.toLowerCase();
      posts = posts.filter((post) => postSearchText(post).includes(q));
    }

    if (!posts.length) {
      container.innerHTML = `<p class="empty-result">No posts matched your filters.</p>`;
      return;
    }

    const byYear = {};
    posts.forEach((post) => {
      const year = post.published.slice(0, 4);
      if (!byYear[year]) byYear[year] = [];
      byYear[year].push(post);
    });

    container.innerHTML = Object.keys(byYear)
      .sort((a, b) => Number(b) - Number(a))
      .map((year) => {
        const rows = byYear[year]
          .map(
            (post) => `
            <li class="archive-row" data-search="${postSearchText(post)}">
              <time datetime="${post.published}">${formatArchiveDate(post.published)}</time>
              <span class="archive-dot" aria-hidden="true"></span>
              <a href="${postUrl(post)}">${post.title}</a>
            </li>`
          )
          .join("");

        return `
          <section class="archive-year-group">
            <h2 class="archive-year">${year}</h2>
            <ul class="archive-timeline">${rows}</ul>
          </section>`;
      })
      .join("");
  }

  function setupArchiveSearch(input, timelineContainer, statusEl) {
    if (!input || !timelineContainer) return;

    const runSearch = () => {
      const query = input.value.trim().toLowerCase();
      const rows = qsa(".archive-row", timelineContainer);
      const groups = qsa(".archive-year-group", timelineContainer);
      let visible = 0;

      rows.forEach((row) => {
        const match = !query || (row.dataset.search || "").includes(query);
        row.hidden = !match;
        if (match) visible += 1;
      });

      groups.forEach((group) => {
        group.hidden = !qsa(".archive-row:not([hidden])", group).length;
      });

      if (statusEl) {
        statusEl.textContent = query ? `${visible} result${visible === 1 ? "" : "s"} found` : "";
      }
    };

    input.addEventListener("input", runSearch);
    runSearch();
  }

  function setupFolderTree() {
    qsa("[data-folder] .folder-head").forEach((button) => {
      button.addEventListener("click", () => {
        const folder = button.closest("[data-folder]");
        const isOpen = folder.classList.toggle("open");
        button.setAttribute("aria-expanded", String(isOpen));
      });
    });
  }

  function showArchiveFilterBanner(filter) {
    const banner = qs("[data-filter-banner]");
    if (!banner) return;

    const parts = [];
    if (filter.tag) parts.push(`Tag: ${filter.tag}`);
    if (filter.category) {
      const cat = blogData.categories.find((c) => c.slug === filter.category);
      if (cat) parts.push(`Category: ${cat.name}`);
    }

    if (filter.query) parts.push(`Search: “${filter.query}”`);

    if (!parts.length) {
      banner.hidden = true;
      return;
    }

    banner.hidden = false;
    banner.innerHTML = `
      <span>Showing ${parts.join(" • ")}</span>
      <a href="${pageUrl("archives.html")}" class="btn btn-secondary">Clear filter</a>`;
  }

  function getPageFilters() {
    const params = new URLSearchParams(window.location.search);
    return {
      tag: params.get("tag") || "",
      category: params.get("category") || "",
      query: params.get("q") || "",
    };
  }

  function prefillSearchInputs() {
    const filter = getPageFilters();
    if (!filter.query) return;
    qsa('input[type="search"]').forEach((input) => {
      if (input.name === "q" || input.hasAttribute("data-blog-search")) {
        input.value = filter.query;
      }
    });
  }

  async function initBlogPage() {
    try {
      await loadBlogData();
    } catch (error) {
      qsa("[data-blog-loading]").forEach((el) => {
        el.textContent = "Could not load blog posts. Please refresh the page.";
        el.classList.add("empty-result");
      });
      return;
    }

    qsa("[data-blog-loading]").forEach((el) => el.remove());

    qsa("[data-recent-posts]").forEach((el) => renderRecentPosts(el, 5));
    qsa("[data-trending-tags]").forEach((el) => renderTrendingTags(el));

    const categoriesContainer = qs("[data-categories-list]");
    if (categoriesContainer) {
      renderCategoriesPage(categoriesContainer);
      setupFolderTree();
    }

    const categoryPosts = qs("[data-category-posts]");
    if (categoryPosts) {
      renderCategoryPostsPage(categoryPosts);
      window.addEventListener("hashchange", () => renderCategoryPostsPage(categoryPosts));
    }

    const tagPosts = qs("[data-tag-posts]");
    if (tagPosts) {
      renderTagPostsPage(tagPosts);
      window.addEventListener("hashchange", () => renderTagPostsPage(tagPosts));
    }

    const tagsContainer = qs("[data-tags-list]");
    if (tagsContainer) renderTagsPage(tagsContainer);

    const archivesTimeline = qs("[data-archives-timeline]");
    if (archivesTimeline) {
      const filter = getPageFilters();
      renderArchivesTimeline(archivesTimeline, filter);
      showArchiveFilterBanner(filter);
      setupArchiveSearch(qs("[data-blog-search]"), archivesTimeline, qs("[data-search-status]"));
    }

    prefillSearchInputs();
  }

  document.addEventListener("DOMContentLoaded", initBlogPage);
})();
