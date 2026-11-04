---
layout: default
title: Publications
permalink: /publications/
description: "Research papers, experiments, and ideas in progress."
---
<header class="page-header">
  <p class="eyebrow">Research</p>
  <h1>Publications<span class="name-dot">.</span></h1>
  <p>Papers, experiments, and ideas in progress.</p>
</header>
<p class="editorial-note">The papers below are illustrative examples. Replace them with your own publications; PDF and code links become available when you add their URLs.</p>

{% assign publication_tags = site.data.publications | map: 'tags' | join: ',' | split: ',' | uniq | sort %}
<div class="publication-tools" data-publication-tools hidden>
  <div class="filter-pills" role="group" aria-label="Filter publications by topic">
    <button class="filter-pill active" type="button" data-filter="All" aria-pressed="true">All</button>
    {% for tag in publication_tags %}{% if tag != '' %}
    <button class="filter-pill" type="button" data-filter="{{ tag | escape }}" aria-pressed="false">{{ tag | escape }}</button>
    {% endif %}{% endfor %}
  </div>
  <p class="filter-status" aria-live="polite" aria-atomic="true" data-filter-status>{{ site.data.publications.size }} publications</p>
</div>
<noscript><p class="section-note">All publications are shown. Enable JavaScript to filter by topic.</p></noscript>

<div class="publication-list">
{% for paper in site.data.publications %}
  {% capture owner_name %}<strong>{{ site.author.name }}</strong>{% endcapture %}
  <article class="publication" data-tags="{{ paper.tags | jsonify | escape }}">
    <div class="publication-topline"><span class="publication-year">{{ paper.year }}</span><div class="publication-tags">{% for tag in paper.tags %}<span class="badge" data-topic="{{ tag | escape }}">{{ tag | escape }}</span>{% endfor %}</div></div>
    <h2>{{ paper.title | escape }}</h2>
    <p class="publication-authors">{{ paper.authors | escape | replace: site.author.name, owner_name }}</p>
    <p class="publication-venue"><em>{{ paper.venue | escape }}, {{ paper.year }}</em></p>
    <div class="publication-actions">
      {% if paper.pdf and paper.pdf != '' %}<a href="{{ paper.pdf | relative_url }}">[PDF]</a>{% else %}<span class="unavailable" title="Add a PDF URL in _data/publications.yml">[PDF]</span>{% endif %}
      {% if paper.code and paper.code != '' %}<a href="{{ paper.code | relative_url }}">[Code]</a>{% else %}<span class="unavailable" title="Add a code URL in _data/publications.yml">[Code]</span>{% endif %}
      {% if paper.abstract and paper.abstract != '' %}<button type="button" data-drawer-toggle="abstract-{{ forloop.index }}" aria-controls="abstract-{{ forloop.index }}" aria-expanded="false" hidden>[Abstract]</button>{% endif %}
      {% if paper.bibtex and paper.bibtex != '' %}<button type="button" data-drawer-toggle="bibtex-{{ forloop.index }}" aria-controls="bibtex-{{ forloop.index }}" aria-expanded="false" hidden>[BibTeX]</button>{% endif %}
    </div>
    <div class="publication-drawers">
      {% if paper.abstract and paper.abstract != '' %}
      <details class="paper-drawer" id="abstract-{{ forloop.index }}"><summary>[Abstract]</summary><div class="drawer-content"><p>{{ paper.abstract | escape }}</p></div></details>
      {% endif %}
      {% if paper.bibtex and paper.bibtex != '' %}
      <details class="paper-drawer" id="bibtex-{{ forloop.index }}"><summary>[BibTeX]</summary><div class="drawer-content"><pre><code>{{ paper.bibtex | escape }}</code></pre></div></details>
      {% endif %}
    </div>
  </article>
{% endfor %}
</div>
{% if site.data.publications.size == 0 %}<p class="empty-state">New research will appear here soon.</p>{% endif %}
