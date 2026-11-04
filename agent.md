# Project Specification: Minimalist Academic & Personal Blog (Jekyll)

## 1. Project Overview
Build a clean, fast, minimalist personal academic and blog website inspired by `https://jinyansu1.github.io/`.
- **Tech Stack**: Pure Jekyll (100% compatible with native GitHub Pages without complex third-party Ruby plugins), HTML5, modern Vanilla CSS, and lightweight Vanilla JS.
- **Core Sections**:
  1. `Home` (`/`): Bio, avatar, social links, News/Updates, Education & Experience.
  2. `Publications` (`/publications/`): Driven by `_data/publications.yml`, supporting interactive topic tag filtering (e.g., `All`, `LLM`, `RL`, `Systems`) and inline collapsible `[Abstract]` & `[BibTeX]` drawers.
  3. `Tech Blog` (`/tech/`): Posts filtered by `category: tech`, with LaTeX math (`KaTeX`) and syntax-highlighted code blocks.
  4. `Personal Blog` (`/life/`): Entertainment & personal posts (`category: life`) for game reviews, anime/movies, travel logs, and casual thoughts, optimized for rich images, GIFs, and looping short videos.

---

## 2. Target Directory Structure
Generate the complete repository with the following file tree:

```text
.
├── _config.yml
├── Gemfile
├── .gitignore
├── index.md
├── publications.md
├── tech.md
├── life.md
├── WRITING_GUIDE.md
├── _data/
│   └── publications.yml
├── _layouts/
│   ├── default.html
│   └── post.html
├── _includes/
│   ├── header.html
│   ├── footer.html
│   ├── figure.html
│   └── gif_video.html
├── _posts/
│   ├── 2026-03-01-sample-tech-post.md
│   └── 2026-03-02-sample-entertainment-post.md
└── assets/
    ├── css/
    │   └── style.css
    ├── js/
    │   └── main.js
    └── images/
        └── .keep
```

---

## 3. Detailed Implementation Requirements

### 3.1 `_config.yml` & Dependencies
- Configure standard GitHub Pages settings:
  - `title`: "Your Name"
  - `email`: "your.email@example.com"
  - `description`: "Personal homepage, tech notes, and playground."
  - `url`: "https://yourusername.github.io"
  - `baseurl`: ""
  - `markdown`: kramdown
  - `highlighter`: rouge
  - `permalink`: `/blog/:year/:month/:day/:title/`
- Include a minimal `Gemfile` using `gem "github-pages", group: :jekyll_plugins` and `gem "webrick"` for optional local preview.

### 3.2 Visual Style & Typography (`assets/css/style.css`)
- **Layout**: Centered single-column container with `max-width: 780px`, `padding: 0 20px`, clean whitespace, and mobile responsiveness.
- **Typography**: System UI / Inter / Georgia clean pairing, comfortable reading line-height (`1.75`), dark gray body text (`#24292f`) on pure white or warm off-white background (`#ffffff`).
- **Header Navigation**: Sticky or clean top bar with site title/name on the left and navigation links (`Home`, `Publications`, `Tech Blog`, `Personal Blog`) on the right, highlighting the active page.
- **Profile Section (`Home`)**: Flexbox two-column intro on desktop (left: bio text + social links; right: circular or softly rounded avatar image `160px x 160px`), stacking cleanly on mobile.

### 3.3 Interactive Publications Page (`publications.md` + `_data/publications.yml` + `assets/js/main.js`)
- Store papers in `_data/publications.yml` with fields:
  - `title`, `authors` (bold the owner's name via HTML or string replacement), `venue`, `year`, `tags` (array, e.g., `["LLM", "RL"]`), `pdf`, `code`, `abstract`, `bibtex`.
- Render a row of interactive tag filter pills at the top of `/publications/`:
  - `All` button (active by default) + dynamically generated unique tag buttons from `_data/publications.yml`.
  - Clicking a tag filters the displayed publication items smoothly via `data-tags` attributes in Vanilla JS.
- Each publication entry displays:
  - Title, authors, italicized venue & year, colored topic badge(s).
  - Action buttons: `[PDF]`, `[Code]`, `[Abstract]`, `[BibTeX]`.
  - Clicking `[Abstract]` or `[BibTeX]` toggles a cleanly styled hidden container right below the paper entry.

### 3.4 Blog System (`Tech Blog` & `Personal Blog`)
- `tech.md` loops through `site.posts` where `post.category == "tech"`, grouped by year or listed chronologically with date (`YYYY-MM-DD`), title, and optional tags.
- `life.md` loops through `site.posts` where `post.category == "life"`, displaying date, title, tag badges (e.g., `Game`, `Anime`, `Travel`), and an optional short excerpt.
- **Post Layout (`_layouts/post.html`)**:
  - Displays post title, date, category badge, and estimated reading time.
  - Loads **KaTeX** (via CDN) when `math: true` is set in the post Front Matter (supporting inline `$...$` and display `$$...$$`).

### 3.5 Image, GIF & Animated Media Components (CRITICAL)
Optimize the blog specifically for rich text + images + GIFs/animations:
1. **Standard Markdown Images (`![alt](url)`)**:
   - Style all `.post-content img` with `max-width: 100%`, `height: auto`, `border-radius: 8px`, `display: block`, `margin: 1.5rem auto`, and a subtle box-shadow.
   - Integrate **medium-zoom** (via CDN `https://cdn.jsdelivr.net/npm/medium-zoom@1.1.0/dist/medium-zoom.min.js`) in `assets/js/main.js` so clicking any image or GIF in a blog post smoothly zooms it into a full-screen lightbox.
2. **Captioned Image / GIF Include (`_includes/figure.html`)**:
   - Usage: `{% include figure.html src="/assets/images/demo.gif" alt="Demo" caption="图1：游戏实机画面演示" width="85%" %}`
   - Renders a `<figure>` tag with customizable max-width, lazy loading (`loading="lazy"`), and a centered `<figcaption>` in muted gray font.
3. **High-Performance Looping "GIF" Include (`_includes/gif_video.html`)**:
   - Since large `.gif` files bloat Git repositories, provide an include for MP4/WebM silent looping videos that behave exactly like GIFs:
   - Usage: `{% include gif_video.html src="/assets/images/clip.mp4" caption="丝滑 60 帧动图效果" width="90%" %}`
   - Renders `<video autoplay loop muted playsinline preload="metadata">` with rounded corners and optional `<figcaption>`.

---

## 4. Starter Content & Documentation
1. Create `_posts/2026-03-01-sample-tech-post.md` (`category: tech`, `math: true`) showing code blocks, LaTeX formulas, and standard Markdown formatting.
2. Create `_posts/2026-03-02-sample-entertainment-post.md` (`category: life`, `tags: [Game, Review]`) demonstrating:
   - Standard Markdown image/GIF embedding.
   - `{% include figure.html %}` with custom width and caption.
   - `{% include gif_video.html %}` example.
3. Create `WRITING_GUIDE.md` in Chinese explaining:
   - How to edit personal info in `_config.yml` and `index.md`.
   - How to add new papers in `_data/publications.yml`.
   - How to write a new Tech or Entertainment blog post and insert images, `.gif`, `.webp`, or looping `.mp4` clips.
   - How to push to GitHub (`<username>.github.io`) to go live automatically.

---

## 5. Execution Steps for Claude Code
1. Create all directories and files listed in Section 2 without omitting any CSS or JS logic.
2. Verify that all internal links, liquid tags (`{% include ... %}`), and YAML Front Matter syntax are valid and error-free.
3. Initialize git (`git init`) if not already initialized, and print a brief summary of the generated structure along with commands to preview locally (`bundle exec jekyll serve`) or push directly to GitHub Pages.