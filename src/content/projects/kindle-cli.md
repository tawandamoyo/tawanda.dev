---
title: Nota CLI
emoji: 💾
metaDescription: A Node.js CLI for extracting and parsing highlights and notes made on Kindle ereaders.
date: "2023-03-02"
summary: A Node.js CLI that parses a Kindle's clippings file into a folder of Markdown.
tags:
  - Node.js
  - cli
  - kindle
  - commander
area: reading
urlPath: kindle-highlights-cli-tool
related:
  - "project:kindle-highlights-desktop-app"
---

### Problem
You create highlights and notes while reading on Kindle, and then what? The file containing the highlights is just one long `My Clippings.txt` file. What if you want all the clippings from one book in their own file, or to see random highlights? 


### Solution

A Command Line Interface built with Node.js and the Commander library. It takes the Kindle's `My Clippings.txt` and returns a folder of books as Markdown files. It can also pull a random highlight into the terminal.

[Nota Desktop](/projects/kindle-highlights-desktop-app/) is the desktop app version. 

[Github](https://github.com/tawandamoyo/kindle-tool-cli)

### How it got here

This started in 2020 as a first attempt at building something useful, written up as it went:
[Part 1](/kindle-highlights-tool/) - the clippings format and a plan;
[Part 2](/kindle-highlights-tool-2/) - parsing the file into books;
[Part 3](/kindle-highlights-tool-3/) - writing each book out to its own file.
