---
title: Kindle Highlights CLI tool
emoji: 💾
metaDescription: A Node JS CLI tool for extracting and parsing highlights and notes made on Kindle ereaders.
date: "2023-03-02"
summary: CLI tool to parse and organize highlights made on Kindle ereaders.
tags:
  - Node.js
  - cli
  - kindle
  - commander
---

### Problem

Many people who do their reading on Kindle e-readers often highlight parts of the text and also take notes. I wanted a way of sorting these highlights into files of individual books.

### Solution

I made a simple Command Line Interface (CLI) tool using Node.js and the Commander library to parse commands. The tool takes in the kindle highlights file, typically named `My Clippings.txt` and found in the `/Documents` folder of the Kindle, and returns a folder of books in Markdown files.

The tool can also be used to get (a) random highlight(s) from the terminal.

[Github](https://github.com/tawandamoyo/kindle-tool-cli)
