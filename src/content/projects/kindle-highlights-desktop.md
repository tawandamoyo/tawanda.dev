---
title: Nota Desktop
emoji: 💾
metaDescription: An Electron desktop app that extracts and organises Kindle highlights and notes so they stay useful after you finish the book.
date: "2021-09-01"
summary: Electron desktop app. Extract and organise highlights so they stay useful after you finish the book.
tags:
  - JavaScript
  - Electron
  - kindle
  - Desktop
area: reading
status: ongoing
urlPath: kindle-highlights-desktop-app
related:
  - "post:building-nota"
  - "project:zhira"
---

### Problem

Many people who read on Kindle e-readers highlight passages and take notes as they go. Amazon
leaves all of it in one undifferentiated `My Clippings.txt` file, which means that by the time you
want a passage back, it is effectively gone.

### Solution

A desktop application built with Electron. It reads the clippings file from the Kindle's
`/Documents` folder, parses it, and returns a folder of books as Markdown files, one per book, and in plain text.

It can also surface a random highlight, which is my favourite use case.

[Github](https://github.com/tawandamoyo/Kindle-Highlights-Desktop-App)
