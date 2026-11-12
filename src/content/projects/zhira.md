---
title: Zhira
emoji: 🧭
metaDescription: A versioned context pipeline over my Kindle highlights, with retrieval and agent-facing tools on top.
date: "2026-07-27"
summary: "Zhira, Shona for “path(s)”, is a versioned context pipeline over a reading corpus of Kindle highlights and notes."
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

*Zhira* is Shona for "path(s)". Kindle highlights extraction and organisation were solved by [Nota](/projects/kindle-highlights-desktop-app/) and the [CLI](/projects/kindle-highlights-cli-tool/); what was left was retrieval - how to find the passage half-remembered, the connection between two books read four years apart, or the common strands in _Why Greatness Cannot Be Planned_ and _Obliquity_.

*Zhira* is a versioned context pipeline: source
data changes, and the system produces a new, checksummed artifact that can be served to a person or a model with citations back to the book and location.

### Where it currently is

Early build. What exists today:

- a fresh-ingest pipeline - parse, canonicalise, merge, index, atomic promote;
- sync classification, detecting added, changed, and deleted records against a prior artifact by source checksum;
- a `doctor` command that validates the manifest and re-verifies recorded checksums;
- BM25 search over an SQLite FTS5 index.

Dense and hybrid retrieval, cited answers, and the MCP server that exposes the corpus to agents are planned.

[Github](https://github.com/tawandamoyo/zhira)
