---
title: Zhira
emoji: 🧭
metaDescription: A versioned context pipeline over five years of Kindle highlights — 14,257 records from 299 books — with retrieval and agent-facing tools on top.
date: "2026-07-27"
summary: "Zhira, Shona for “path(s)”, is a versioned context pipeline over a reading corpus, turning Kindle highlights and notes into a retrievable, reliable, cited context for humans and models. Early build."
tags:
  - Python
  - Retrieval
  - Context Engineering
  - kindle
area: reading
status: ongoing
link: https://github.com/tawandamoyo/zhira
related:
  - "project:kindle-cli"
---

### What this is

*Zhira* is Shona for "path(s)". Extraction and organisation were solved years ago by [Nota](/projects/kindle-highlights-desktop-app/) and the [CLI](/projects/kindle-highlights-cli-tool/); what was left was retrieval,  finding the passage half-remembered, and the connection between two books read four years apart.

The corpus is real: currently **over 14,000 records from 299 books**, roughly 620,000 words, going back 6 years.

The product is a versioned context pipeline: source
data changes, and the system produces a new, checksummed artifact you can diff, verify, and serve, to a person or to a model with citations back to the book and location.

### Where it currently is

Early build. What exists today:

- a fresh-ingest pipeline — parse, canonicalise, merge, index, atomic promote;
- sync classification, detecting added, changed, and deleted records against a prior artifact by source checksum;
- a `doctor` command that validates the manifest and re-verifies recorded checksums;
- BM25 search over an SQLite FTS5 index.

Dense and hybrid retrieval, cited answers, and the MCP server that exposes the corpus to agents are planned, not built.

[Github](https://github.com/tawandamoyo/zhira)
