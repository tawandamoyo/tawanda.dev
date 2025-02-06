---
layout: blog.njk
title: Articles
date: 2017-01-01
pagination:
  data: collections.filteredPosts
  size: 20
permalink: "blog{% if pagination.pageNumber > 0 %}/page/{{ pagination.pageNumber }}{% endif %}/index.html"
metaDescription: Blog page listing various posts.
subtitle: A collection of technical blog posts and random thoughts
eleventyNavigation:
  key: Blog
  order: 2
---
