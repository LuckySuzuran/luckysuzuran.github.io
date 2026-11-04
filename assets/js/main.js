/* Small enhancements; the content and publication drawers work without JS. */
(() => {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  function initPublicationDrawers() {
    document.querySelectorAll("[data-drawer-toggle]").forEach(button => {
      const drawer = document.getElementById(button.dataset.drawerToggle);
      if (!drawer) return;
      const summary = drawer.querySelector("summary");
      button.hidden = false;
      if (summary) summary.hidden = true;
      button.addEventListener("click", () => {
        drawer.open = !drawer.open;
        button.setAttribute("aria-expanded", String(drawer.open));
      });
      drawer.addEventListener("toggle", () => {
        button.setAttribute("aria-expanded", String(drawer.open));
      });
    });
  }

  function initPublicationFilters() {
    const tools = document.querySelector("[data-publication-tools]");
    if (!tools) return;

    const buttons = Array.from(tools.querySelectorAll("[data-filter]"));
    const papers = Array.from(document.querySelectorAll(".publication[data-tags]"));
    const status = tools.querySelector("[data-filter-status]");
    const tags = new Map(papers.map(paper => {
      try { return [paper, JSON.parse(paper.dataset.tags)]; }
      catch { return [paper, []]; }
    }));

    tools.hidden = false;
    buttons.forEach(button => {
      button.addEventListener("click", () => {
        const filter = button.dataset.filter;
        let visible = 0;
        buttons.forEach(item => {
          const active = item === button;
          item.classList.toggle("active", active);
          item.setAttribute("aria-pressed", String(active));
        });
        papers.forEach(paper => {
          const show = filter === "All" || tags.get(paper).includes(filter);
          const wasHidden = paper.hidden;
          paper.hidden = !show;
          paper.classList.remove("is-entering");
          if (show) {
            visible += 1;
            if (wasHidden && !reduceMotion.matches) paper.classList.add("is-entering");
          } else {
            paper.querySelectorAll("details[open]").forEach(drawer => { drawer.open = false; });
          }
        });
        if (status) status.textContent = `${visible} publication${visible === 1 ? "" : "s"}${filter === "All" ? "" : ` · ${filter}`}`;
      });
    });
  }

  function initMath() {
    const content = document.querySelector(".post-content");
    if (!content || document.body.dataset.math !== "true" || typeof window.renderMathInElement !== "function") return;
    window.renderMathInElement(content, {
      delimiters: [
        { left: "$$", right: "$$", display: true },
        { left: "$", right: "$", display: false },
        { left: "\\(", right: "\\)", display: false },
        { left: "\\[", right: "\\]", display: true }
      ],
      throwOnError: false,
      trust: false,
      ignoredTags: ["script", "noscript", "style", "textarea", "pre", "code", "option"]
    });
  }

  function initImageZoom() {
    if (typeof window.mediumZoom !== "function") return;
    const images = Array.from(document.querySelectorAll(".post-content img"))
      .filter(img => !img.closest("a") && !img.hasAttribute("data-no-zoom"));
    if (!images.length) return;
    const zoom = window.mediumZoom(images, { margin: 24, background: "rgba(255,255,255,0.97)", scrollOffset: 60 });
    images.forEach(img => {
      img.tabIndex = 0;
      img.setAttribute("role", "button");
      img.setAttribute("aria-label", `Zoom image: ${img.alt || "blog image"}`);
      img.setAttribute("aria-expanded", "false");
      img.addEventListener("keydown", event => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          zoom.open({ target: img });
        }
      });
    });
    zoom.on("open", event => { event.target.setAttribute("aria-expanded", "true"); });
    zoom.on("closed", event => { event.target.setAttribute("aria-expanded", "false"); });
  }

  function initVideoMotion() {
    const videos = Array.from(document.querySelectorAll(".post-content video[autoplay]"));
    function syncMotion() {
      videos.forEach(video => {
        if (reduceMotion.matches) {
          video.pause();
          video.removeAttribute("autoplay");
        } else {
          video.setAttribute("autoplay", "");
          const playing = video.play();
          if (playing && typeof playing.catch === "function") playing.catch(() => {});
        }
      });
    }
    syncMotion();
    if (reduceMotion.addEventListener) reduceMotion.addEventListener("change", syncMotion);
  }

  function init() {
    initPublicationDrawers();
    initPublicationFilters();
    initMath();
    initImageZoom();
    initVideoMotion();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})();
