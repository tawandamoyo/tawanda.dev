---
title: Africa Compute Tracker
emoji: 🗺️
metaDescription: An open, version-controlled dataset of AI-relevant datacentre infrastructure across Africa — 14 facilities in 5 countries, every claim sourced, dated, and confidence-rated.
date: "2026-04-14"
summary: An open, version-controlled dataset of AI-relevant datacentre infrastructure across Africa — 14 facilities in 5 countries, every data point sourced, dated, and assigned a confidence level.
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

14 facilities across 5 countries — South Africa, Kenya, Nigeria, Egypt, and Morocco — covering
hyperscaler cloud regions, large carrier-neutral colocation campuses, and purpose-built AI compute
facilities announced, under construction, or expanded within the last three years.

What the dataset shows so far: African AI compute is heavily concentrated in South Africa, and most
of the headline capacity is *announced* rather than operational.

### How it is built

A pipeline, not just a website. Sources are triaged in an inbox, promoted to cited evidence, and only then written into the dataset — one YAML file per facility, validated against a JSON schema on every build.

Every data point carries a source, a retrieval date, and a trust tier: company filings and official announcements are weighted above trade press, local journalism, and social media, and the tier travels with the value onto the page, so a reader can see how much weight a given number deserves.
The dataset is version-controlled and openly licensed (CC-BY 4.0).
