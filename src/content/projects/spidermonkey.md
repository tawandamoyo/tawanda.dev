---
title: SpiderMonkey - TC39 Joint Iteration
emoji: 🦎
metaDescription: Two patches landed in Firefox 133's JavaScript engine - the nightly-gated pref for the TC39 Joint Iteration proposal and the placeholder implementation for Iterator.zip.
date: "2024-11-01"
summary: Two patches landed in Firefox 133 - the nightly-gated preference controlling the TC39 Joint Iteration proposal, and the placeholder implementation for Iterator.zip.
tags:
  - SpiderMonkey
  - JavaScript
  - TC39
  - Browsers
area: oss
link: https://bugzilla.mozilla.org/show_bug.cgi?id=1918735
related:
  - "post:implementing-javascript-proposal-in-firefox"
---

### What this is

Contributed to Firefox's JavaScript engine through Outreachy, mentored by Dan Minor at Mozilla.

I landed the nightly-only preference that gates the TC39 [Joint Iteration](https://github.com/tc39/proposal-joint-iteration)
proposal (`javascript.options.experimental.joint_iteration`) - the switch the rest of the proposal
builds on, and a blocker for two dependent bugs - and the placeholder implementation for
`Iterator.zip` : an `#ifdef NIGHTLY_BUILD` guard in `Iterator.js`, registered as a static
method and conditionally removed when the pref is off.

Both patches shipped in **Firefox 133**.

- [Bug 1918735](https://bugzilla.mozilla.org/show_bug.cgi?id=1918735) - add the Joint Iteration pref
- [Bug 1923146](https://bugzilla.mozilla.org/show_bug.cgi?id=1923146) - placeholder implementation for `Iterator.zip`

Important lessons on working on a massive codebase with thousands of contributors.
