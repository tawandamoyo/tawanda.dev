---
title: Africa Compute Tracker
emoji: 🗺️
metaDescription: An open, version-controlled dataset of AI-relevant datacentre infrastructure across Africa. Every claim is sourced, dated, and confidence-rated.
date: "2026-04-14"
summary: An open, version-controlled dataset of AI-relevant datacentre infrastructure across Africa. Every data point is sourced, dated, and assigned a confidence level.
tags:
  - Research
  - Data
  - Compute Governance
area: field
status: live
link: https://africacomputetracker.org
urlPath: african-datacentre-tracker
related:
  - "post:intelligent-agents"
---

### What it knows

Currently at 14 facilities across 5 countries - South Africa, Kenya, Nigeria, Egypt, and Morocco - covering
hyperscaler cloud regions, large carrier-neutral colocation campuses, and purpose-built AI compute
facilities announced, under construction, or expanded within the last three years.

What the dataset shows so far: African AI compute is heavily concentrated in South Africa, and most
of the headline capacity is *announced* rather than operational.

### How it is built

A data pipeline where sources are triaged in an inbox, promoted to cited evidence, and only then written into the dataset - one YAML file per facility, validated against a JSON schema at build time.

Every data point carries a source, a retrieval date, and a trust tier: company filings and official announcements are weighted above trade press, local journalism, and social media, and the tier travels with the value onto the page, so a reader sees how much weight a given number has.
The dataset is version-controlled and openly licensed (CC-BY 4.0).
