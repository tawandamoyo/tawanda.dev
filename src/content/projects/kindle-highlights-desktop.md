---
title: Kindle Highlights Desktop App
emoji: 💾
metaDescription: A Desktop application for viewing and managing highlights and notes made on Kindle ereaders.
date: "2024-02-02"
summary: An Electron desktop app that imports, parses, and organizes your Kindle highlights so they stay useful after you finish a book.
tags:
  - JavaScript
  - Electron
  - kindle
  - Desktop
area: tools
status: ongoing
---

### Problem

Many people who do their reading on Kindle e-readers often highlight parts of the text and also take notes. I wanted a way of sorting these highlights into files of individual books.

### Solution

A desktop application built with Electron. The tool takes in the kindle highlights file, typically named `My Clippings.txt` and found in the `/Documents` folder of the Kindle, and returns a folder of books in Markdown files.

The tool can also be used to get (a) random highlight(s) from the terminal.

[Github](https://github.com/tawandamoyo/Kindle-Highlights-Desktop-App)
