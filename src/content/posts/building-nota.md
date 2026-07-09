---
title: "Building Nota- An Open Source Desktop Application for Managing Kindle Highlights and Notes"
urlPath: "building-nota-electron-desktop-app"
date: "2021-09-01"
categories: 
  - "learning"
  - "building"
  - "open source"
  - "electron"
---

I've previously [written](https://tawanda.dev/posts/2020-08-10-building-my-first-app-a-kindle-reader-highlights-extractor-part-1/) about the simple [JavaScript script]  I wrote which organizes  highlights and notes made on Kindle ereaders. It's on [Github](https://github.com/tawandamoyo/KindleKlipper).

I use the script a lot but I must admit that it's not user friendly. I recently had to use it and I almost wept - there was no easy way to specify the file to be loaded, and very sparse instructions or explanations.

That day I learnt some valuable lessons about the craft of making software. I learnt the importance of good documentation. At the very least there should always be a clearly written README with screenshots if possible. And if you are building a tool that runs in the terminal, or a CLI it's important to give hints, and provide help pages etc.

But I digress - the realization that my app is virtually unusable made me think of converting it into a desktop app.

The easiest way to make a desktop app seems to be Electron. Electron is a JavaScript runtime that makes it possible to build cross-platform desktop apps using JavaScript, HTML and CSS. 

Though Electron gets bad rep from a lot of developers it has some good things in its favor. First it's JavaScript, which means I get to use a language I'm already familiar with. Also since Electron apps are similar to web apps I can easily style my app using CSS. 

The way Electron works is it sort of combines Chromium and Node.js enabling stuff that's not possible when using either on it's own. This property gives Electron incredible power because it's then possible to use Node.js features like filesystem and OS access while at the same time having access to DOM features and Web APIs.

The app I'm building is called Nota (Latin for Notes) and it'll live in this [Github repo](https://github.com/tawandamoyo/Nota). I'll be committing and pushing to it as I go. 
