---
layout: default
title: Home
description: "A home for research, technical notes, and things worth remembering."
---
<section class="profile" aria-labelledby="profile-name">
  <div class="profile-copy">
    <p class="eyebrow">A small corner of the internet</p>
    <h1 id="profile-name">{{ site.author.name | escape }}</h1>
    <p class="profile-role">{{ site.author.role | escape }}</p>
    <p>Hi, welcome! I’m interested in how intelligent systems learn, reason, and interact with the world. This is where I share research, work through technical ideas, and collect a few things I enjoy along the way.</p>
    <p class="profile-note">This is a starter biography. Replace it with your own story, current role, and research interests.</p>
    <div class="social-links" aria-label="Find me online">
      <a href="mailto:{{ site.email | escape }}">Email <span aria-hidden="true">↗</span></a>
      {% if site.social.github != '' %}<a href="{{ site.social.github | escape }}">GitHub <span aria-hidden="true">↗</span></a>{% endif %}
      {% if site.social.scholar != '' %}<a href="{{ site.social.scholar | escape }}">Google Scholar <span aria-hidden="true">↗</span></a>{% endif %}
      {% if site.social.orcid != '' %}<a href="{{ site.social.orcid | escape }}">ORCID <span aria-hidden="true">↗</span></a>{% endif %}
    </div>
  </div>
  <div class="profile-portrait">
    <img src="{{ site.author.avatar | relative_url }}" alt="{{ site.author.name | escape }} — placeholder avatar" width="160" height="160" fetchpriority="high">
    <span>{{ site.author.location | escape }}</span>
  </div>
</section>

<section class="home-section" aria-labelledby="interests-heading">
  <h2 id="interests-heading">Research interests</h2>
  <p>I’m exploring language models, reinforcement learning, and the systems that make them useful. I like turning open questions into small, reproducible experiments.</p>
  <div class="interest-tags"><span class="badge">Language models</span><span class="badge">Reinforcement learning</span><span class="badge">Efficient systems</span></div>
  <a class="text-link" href="{{ '/publications/' | relative_url }}">Browse publications <span aria-hidden="true">→</span></a>
</section>

<section class="home-section" aria-labelledby="news-heading">
  <div class="section-heading"><h2 id="news-heading">News & updates</h2><span class="section-note">Lately</span></div>
  <ul class="news-list">
    <li><time datetime="2026-03-02">Mar 2026</time><p>A little room for life outside the editor: <a href="{{ '/blog/2026/03/02/sample-entertainment-post/' | relative_url }}">the first personal post</a>.</p></li>
    <li><time datetime="2026-03-01">Mar 2026</time><p>Hello, world. This notebook begins with <a href="{{ '/blog/2026/03/01/sample-tech-post/' | relative_url }}">a small note on gradient descent</a>.</p></li>
  </ul>
</section>

<section class="home-section" aria-labelledby="education-heading">
  <h2 id="education-heading">Education</h2>
  <div class="timeline-item"><div><h3>Your university</h3><p>Degree in your field · Research group or advisor</p></div><span>20XX – 20XX</span></div>
  <p class="section-note">Replace this entry with your education.</p>
</section>

<section class="home-section" aria-labelledby="experience-heading">
  <h2 id="experience-heading">Experience</h2>
  <div class="timeline-item"><div><h3>Your lab or organization</h3><p>Your role · A short description of your work</p></div><span>20XX – Present</span></div>
</section>

<section class="home-section latest-writing" aria-labelledby="writing-heading">
  <div class="section-heading"><h2 id="writing-heading">From the notebook</h2><span class="section-note">Recent writing</span></div>
  <ul class="recent-posts">
    {% for post in site.posts limit: 3 %}
    <li><div><span class="eyebrow">{% if post.category == 'tech' %}Tech notes{% else %}Life & everything else{% endif %}</span><h3><a href="{{ post.url | relative_url }}">{{ post.title | escape }}</a></h3></div><time datetime="{{ post.date | date_to_xmlschema }}">{{ post.date | date: '%b %d' }}</time></li>
    {% endfor %}
  </ul>
</section>
