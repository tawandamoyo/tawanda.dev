---
title: "From Proposal to Browser: Implementing JavaScript Features in Firefox"
urlPath: "implementing-javascript-proposal-in-firefox"
date: "2024-10-15"
categories: 
  - "Web"
tags: 
  - "firefox"
  - "javascript"
  - "programming"
  - "browsers"
  - "spidermonkey"
---

> [!NOTE] This post is the first in a series of posts about implementing a new JavaScript proposal in the Firefox Web Browser


## Introduction

I have always been fascinated by how the web works, particularly web browsers. Recently, as part of Outreachy, I got an opportunity to contribute to implementing a new JavaScript proposal in the Firefox web browser.

This series of posts documents the process of implementing a new JavaScript proposal in the Firefox web browser. It aims to give insights into the process, challenges, and learning opportunities involved in contributing to a major open source project. 

My motivation goes beyond the thrill of diving deep into browser internals and web standards, I believe that understanding how language features are implemented makes us better developers. It gives us a deeper appreciation for the tools we use daily, and empowers us to contribute to the evolution of the wonderful invention that is the web. 

## The Evolution of JavaScript

JavaScript (more formally ECMAScript) is the programming language that allows us to have interactivity in web pages.  Besides web browsers, JavaScript also works in other environments like Node.js and in embedded systems. 

### The ECMAScript Specification

How JavaScript behaves in all these environments, the functionality it has etc is  formally specified as the ECMAScript Specification. This specification is overseen by a body called  TC39 which is responsible for maintaining and evolving the language. 

### The TC39 Process

Ecma [TC39](https://ecma-international.org/technical-committees/tc39/) (Technical Committee 39) is responsible for evolving the ECMAScript programming language and authoring the specification. The committee operates by consensus and has discretion to alter the specification as it sees fit. However, the general process for making changes to the specification is as follows. [^2]

Changes to the language, called proposals, go through a process that provides guidelines for evolving from an idea to a ully specified feature complete with tests and multiple implementations. There are six stages: a strawperson stage and five maturity stages, and the committee must approve acceptance for each stage. 

When these proposals pass they are implemented in the web browser so that the new functionality is available to users in JavaScript environments. 

### Recent JavaScript Proposals
Below are two proposals at Stage 2, which means they are expected to become part of the spec.

#### 1. [Joint Iteration](https://github.com/tc39/proposal-joint-iteration)

This proposal is "to synchronise the advancement of multiple iterators". While that might sound inscrutable, this proposal intends to add functionality to programmatically operate over multiple Iterators (think arrays). The most common example I can think of is `zip` in many languages like Python, where you can do something like:

```python
x = [1, 2, 3]
y = [4, 5, 6]
zipped = zip(x, y)

print(list(zipped))

[(1, 4), (2, 5), (3, 6)]

```

Currently you cannot do this in JavaScript without third party libraries. 

#### 2. [Iterator.range](https://github.com/tc39/proposal-iterator.range)

This proposal is for adding `Iterator.range` to JavaScript. Again I will give a Python example to show what this means.

In Python you can do something like:

```python

for i in range(4):
	print(i * 2)

"""
output:

0
2
4
6
```

This is such useful thing to do that there are countless questions about how to do it online, and plenty of third party libraries that make it possible. 

Now, when a proposal is accepted it should be added to the JavaScript engine. Let us take a quick overview of the structure of web browsers. 

## The Anatomy of a Web Browser

Web browsers are perhaps the most widely distributed software in the world, being on virtually every modern smartphone, smart TV, watches, computers and other embedded systems.

While there are many browsers such as Firefox, Chrome and Safari, the  functionality is more or less the same:  The primary function is to is to locate and retrieve web pages, images, videos, documents, and other files from servers and display them on the user’s device. [^1] So the browser will have parts that make and interpret network requests, and parts that render the fetched resources. There is functionality to render the resources for example parsing the HTML, drawing out the CSS and executing JavaScript


The part of the browser that executes JavaScript code is called the JavaScript engine and there are different ones in different browsers- Chromium based browsers such as Chrome, Edge, and Brave use V8, Firefox uses SpiderMonkey, and Safari uses JavaScriptCore. 

Now when a new proposal passes at TC39 the functionality it describes is added to the browser engine. This series of posts describes how a new proposal is implemented in the Firefox web browser (more specifically in SpiderMonkey)


## The Proposal Implementation Process

Implementing a proposal in a JavaScript engine is a lengthy process that involves multiple steps such as:
- Understanding the proposal: Reviewing the specification and test cases
- Planning the implementation: Determining where and how to add the new feature in the existing codebase
- Coding: Writing the actual implementation
- Code Review: Getting feedback from other core developers
- Testing: Testing to see if the implementation is correct
- Performance optimization: Ensuring the new feature does not affect performance
- Integration: Merging the new feature into the main codebase

Throughout this series we'll dive into each of these steps using a real proposal as a case study.

## Series Overview

This series will cover:
1. **Setting up the Firefox development environment:** How to get started with Firefox development, how to submit code, `moz phab`, code reviews, and the nuances of using Git over Mercurial with `git cinnabar`
2. **Understanding SpiderMonkey**: An overview of Firefox's JavaScript engine
3. **Implementing the Proposal**: A walkthrough of adding a new feature to SpiderMonkey
4. **Testing and Debugging**: Insights into testing and debugging methodologies for web browsers. 
5. **Lessons and reflections**: What I learnt from this experience

## What's Next

In the next post, we'll dive deep into setting up the Firefox development environment, including the pains of using Git on Firefox. 


---
Did you find this post helpful? Have questions or suggestions? Feel free to leave a comment below or reach out on [@tbmoyo](https://twitter.com/tbmoyo).