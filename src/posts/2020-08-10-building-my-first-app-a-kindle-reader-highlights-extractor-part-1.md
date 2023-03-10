---
title: "Building my first app- A Kindle Reader Highlights Extractor (Part 1)"
urlPath: "kindle-highlights-tool"
date: "2020-08-10"
categories: 
  - "software-development"
tags: 
  - "javascript"
  - "programming"
  - "projects"
coverImage: "kindle-e1613119249898.jpg"
---

I have been searching in vain for an app that can find all the highlights I make on my Kindle Paperwhite. These clippings may be key ideas, unfamiliar topics to be explored later, an interesting passage or quote or some other information I might need. Also now that I'm blogging again, it'd be nice to just export the highlights to my blog.

(Un)fortunately I couldn't find anything that meets these needs so I figured I could as well build my own app. Over the next few weeks and a number of posts I'll detail how I'm progressing. Hopefully I will manage to get it working at some point.

## Pleriminaries:

I decided to use JavaScript for the simple reason that it's the language I am most familiar with, and the one I want to get better at. I suspect something like Python might be more suited to the task but I'll have to live with that.

On the Kindle reader the clippings are stored in a txt file named 'clippings.txt' (Brilliant, isn't it?). This file contains for each highlight the book's title and author, the time and date of the highlight, the location in the book and the clipping itself in the format below:

```txt
Mirrors (Eduardo Galeano)
- Your Highlight at location 4481-4481 | Added on Wednesday, 6 November 2019 13:36:03

“War is God’s way of teaching us geography.”
==========
Mirrors (Eduardo Galeano)
- Your Highlight at location 4879-4879 | Added on Wednesday, 6 November 2019 17:45:36

To be natural and clean, like the water we drink, love must be free and mutual. But men demand obedience and deny pleasure.
==========
A Brightness Long Ago (Guy Gavriel Kay)
- Your Highlight at location 214-214 | Added on Sunday, 10 November 2019 14:25:42

We make our own choices sometimes, sometimes they are made for us.
==========
﻿A Brightness Long Ago (Guy Gavriel Kay)
- Your Highlight at location 217-217 | Added on Sunday, 10 November 2019 14:27:23

Opportunities given are responsibilities.
==========
A Brightness Long Ago (Guy Gavriel Kay)
- Your Highlight at location 263-265 | Added on Monday, 11 November 2019 00:34:32

I have often thought that the world the god has made—in our time, at least—is not generally kind to good men. I do not know what that says about me and my own life.

```

Now, you may wonder why I can't simply copy and paste from the txt file. It would after all be a very simple solution.

Here's why:

1. The highlights are added to the file in chronological order. The first highlight made is on top, and the last bottom. This means a highlight of the same book, made at a later time, can be anywhere on the document.
2. There is so much information that I can extract from every highlight that I may find use for, this includes the location in the book (useful for organizing the highlights in the order they appear in the book, rather than when the highlight was made)
3. In addition to 2 it'll make formatting so much easier. For example if I export the clippings I made while reading Guy Gavriel Kay's brilliant _A Brightness Long Ago_, I don't want every highlight to tell me the time, author, book title and date.
4. Well I think it'll be a great learning experience (most important)

## Planning

The goal is to be able to see all the highlights from a certain book. Allow me to namedrop Aristotle's thoughts on building software:

> We deliberate not about ends but about means. For a doctor does not deliberate whether he shall heal, nor an orator whether he shall persuade, nor a statesman whether he shall produce law and order, nor does any one else deliberate about his end. They assume the end and consider how and by what means it is to be attained; and if it seems to be produced by several means they consider by which it is most easily and best produced, while if it is achieved by one only they consider how it will be achieved by this and by what means this will be achieved, till they come to the first cause, which in the order of discovery is last.
> 
> \- Aristotle, Nicomachean Ethics Book III

With that in mind here is the general plan of the steps I need to take to achieve that objective. These steps are likely to be revised as I learn more things.

## Step 1: Get the clippings file from Kindle into PC (or onto server)

- I'll probably do this after Step 2. I'm sure the node file system module has easy ways of implementing this

## Step 2: Manipulate the data:

- firstly I need to break the file down into individual blocks containing a quotation, book title and other pieces of information
- Then I need to store this in some format that allows me to programmatically search through this data.

## Step 3: Make a Graphical Interface, release

- Once the app is working I think I will make a user interface that makes it easier for non-developers to use
- Could make it a web app, or a desktop one via something like Electron
- Open Source (yay!)

That's it. Part 2 coming tomorrow.
