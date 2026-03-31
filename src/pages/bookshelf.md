---
title: Bookshelf
subtitle: "Live shelf from my Kindle highlights"
metaDescription: "Automatically built from the latest entries in My Clippings.txt."
date: 2026-02-04
permalink: /bookshelf/index.html
eleventyNavigation:
  key: Bookshelf
  order: 2.5
---

I keep this page in sync with the `My Clippings.txt` export from my Kindle. Whenever I drop a new file into the repo, the list below updates automatically based on the most recent highlight dates.

{% set books = bookshelf.current %}
{% if books.length %}
<div class="book-grid">
{% for book in books %}
<article class="book-card">
<h3>{{ book.title }}</h3>
<p class="book-date">Last highlight: {{ book.lastHighlightReadable }}</p>
{% if book.lastHighlight %}
<blockquote>{{ book.lastHighlight }}</blockquote>
{% endif %}
</article>
{% endfor %}
</div>
<p class="muted">Window: last {{ bookshelf.lookbackDays }} days. Last file update: {{ bookshelf.lastUpdated or 'unknown' }}.</p>
{% else %}
<p>No highlights in the last {{ bookshelf.lookbackDays }} days. Drop an updated <code>My Clippings.txt</code> into <code>src/</code> to refresh this page.</p>
{% endif %}
