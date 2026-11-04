# A small academic notebook

A minimalist Jekyll homepage, publications list, technical blog, and personal scrapbook. Built with HTML, CSS, and vanilla JavaScript; no custom Jekyll plugins, theme dependency, or JavaScript build step.

## Start locally

Install Ruby and Bundler, then run:

```sh
bundle install
bundle exec jekyll serve
```

Open `http://127.0.0.1:4000`. For a production check:

```sh
bundle exec jekyll build --strict_front_matter
```

## Make it yours

- `_config.yml`: name, contact information, social links, avatar, site URL.
- `index.md`: biography, news, education, and experience.
- `_data/publications.yml`: papers, topic tags, abstracts, BibTeX, and links.
- `_posts/`: dated Markdown posts with `category: tech` or `category: life`.
- `_includes/figure.html` and `gif_video.html`: captioned, responsive media.
- `assets/css/style.css` and `assets/js/main.js`: styling and enhancements.

All personal details and papers are explicit placeholders. Replace them before publishing. The bundled SVG illustrations and GIF are original demo assets. The sample video is MDN's remotely hosted CC0 flower clip; swap its URL for a local MP4/WebM to use your own media. KaTeX and medium-zoom load from pinned CDN versions only on pages that need them.

Read [WRITING_GUIDE.md](WRITING_GUIDE.md) for the full Chinese editing and publishing guide.

## GitHub Pages

Create `<username>.github.io`, update `url` in `_config.yml`, then push this repository. Select **Settings → Pages → Deploy from a branch → main → / (root)**. A project repository also needs `baseurl: "/repository-name"`.

```sh
git add .
git commit -m "Build personal Jekyll website"
git branch -M main
git remote add origin https://github.com/<username>/<username>.github.io.git
git push -u origin main
```

## Optional source check

```sh
node scripts/check-source.mjs
```

This dependency-free check validates the expected repository structure, template block balance, local references, and JavaScript syntax and exercises the publication interactions. It is a source check, not a substitute for an actual Jekyll build or browser testing.
