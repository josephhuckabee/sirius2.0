---
title: Space News
layout: base.njk
tags: navItem
pageClass: exploration
navOrder: 7
---
<section class="hero">
  <div class="hero__content">
    <p class="eyebrow">Updates</p>
    <h1>Live space news</h1>
    <p>Fresh updates from NASA, ESA, and Space.com. This page refreshes automatically.</p>
  </div>
</section>

<section class="history">
  <h2>Latest headlines</h2>
  <div class="news-controls">
    <label for="space-news-sort">Sort by</label>
    <select id="space-news-sort">
      <option value="date">Most recent</option>
      <option value="date-asc">Oldest</option>
      <option value="title">Title (A–Z)</option>
      <option value="source">Source (A–Z)</option>
    </select>
  </div>
  <div id="space-news" class="grid-wrapper">
    <article class="grid-box">
      <p>Loading latest updates...</p>
    </article>
  </div>
</section>

<script src="/js/space-news.js"></script>
