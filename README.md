# Amna Khan Blog

University lab project — a static blog documenting my Computer Engineering journey at UET Lahore, Faisalabad Campus.

Built with **HTML**, **CSS**, and **JavaScript**. Layout inspired by a class reference project, implemented independently with Amna Khan branding.

## Reference Project

| Item | Details |
|------|---------|
| **Reference URL** | [https://zainab937-gif.github.io/Zainab-aamir1/](https://zainab937-gif.github.io/Zainab-aamir1/) |
| **Reference author** | Zainab Aamir |
| **Reference stack** | Jekyll + Chirpy theme (GitHub Pages) |
| **Reference layout** | Left sidebar navigation, main content, right panel (search, recent posts, tags) |
| **Our implementation** | Pure HTML/CSS/JS — same UX structure, different theme and codebase |

This project follows the reference **structure** (categories, tags, archives, folder organization) but does **not** copy its design or Jekyll setup.

---

## Deploy on GitHub Pages

### Step 1 — Create a GitHub repository

1. Go to [github.com/new](https://github.com/new)
2. Name the repo (example: `amnakhan-blogpost`)
3. Set visibility to **Public** (required for free GitHub Pages)
4. Do **not** add README if uploading existing files
5. Click **Create repository**

### Step 2 — Push this project

Open terminal in the project folder:

```bash
git init
git add .
git commit -m "Add Amna Khan university blog"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/amnakhan-blogpost.git
git push -u origin main
```

Replace `YOUR-USERNAME` with your GitHub username.

### Step 3 — Enable GitHub Pages

1. Open your repo on GitHub
2. Go to **Settings** → **Pages**
3. Under **Build and deployment**:
   - **Source:** Deploy from a branch
   - **Branch:** `main` → `/ (root)` → **Save**
4. Wait 1–3 minutes for deployment

### Step 4 — Open your live site

Your site URL will be:

```
https://YOUR-USERNAME.github.io/amnakhan-blogpost/
```

> If the repo is named `YOUR-USERNAME.github.io`, the URL is `https://YOUR-USERNAME.github.io/` (no subfolder).

### Important files for GitHub Pages

| File | Purpose |
|------|---------|
| `.nojekyll` | Tells GitHub not to run Jekyll (needed for `_`-free static sites) |
| `index.html` | Home page |
| `data/posts.json` | Post metadata loaded by JavaScript |

---

## Project Structure

```
amnakhan-blogpost/
├── index.html              # Home (Welcome + About + reference note)
├── categories.html         # Posts by category
├── tags.html               # All tags with post counts
├── archives.html           # Full list + search
├── style.css               # Amna Khan theme
├── script.js               # Sidebar, copy buttons
├── js/blog.js              # Loads posts.json, renders listings
├── data/
│   ├── posts.json          # Metadata for all posts
│   └── post-bodies.json    # Article content
├── posts/                  # Generated HTML per post
│   ├── foundations-of-my-journey/
│   ├── programming-fundamentals/
│   └── database-systems/
└── tools/
    └── build-posts.mjs     # Regenerate post HTML after edits
```

---

## Local Preview

GitHub Pages serves files over HTTP. Locally, use a simple server:

```bash
npx serve .
```

Open `http://localhost:3000`

---

## Adding New Posts

1. Add entry to `data/posts.json`
2. Add content to `data/post-bodies.json`
3. Run: `node tools/build-posts.mjs`
4. Commit and push — GitHub Pages updates automatically

---

## Author

**Amna Khan** — Computer Engineering student  
Email: amnakhan.dev123@gmail.com  
GitHub: [github.com/amna-khan14](https://github.com/amna-khan14)
