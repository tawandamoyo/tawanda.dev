---
title: "Implementing a TC39 proposal in Spidermonkey"
urlPath: "implementing-javascript-proposal-spidermonkey"
date: "2024-10-03"
categories: 
  - "Web"
tags: 
  - "javascript"
  - "programming"
  - "browsers"
  - mozilla
  - spidermonkey
related:
  - "project:webstandards"
---

## Introduction

The JavaScript language, like all languages human and computer, is continously evolving though at a lower pace than human languages. 

Now the JavaScript language has a steering commitee that accepts new ideas , methods etc into the language. 

### Web Standards in One Paragraph

The web is made of a loose coalition of parties with some sort of reasonable rules about how it works. Because of how the web developed, through experimentation, and hacks, and in different places, these rules are sometimes not precise, nor are they equally or similarly implemented. These rules exist for things like how [HTML]()  or [CSS]() should behave, [JS](). They are called [web standards]().

A proposal is made, with some poepl championing it. They draft a document of the proposal, where it is found and how it is implemented in other languages etc. 

Then the proposal is implemented in the browser (for JavaScript it's more accurately the browser engine), so that it works. All browser vendors do this.

This series of posts details how to implement a proposal in the JavaScript Engine called SpiderMonkey, which powers the Firefox web browser. 

### Browsers in One Paragraph
A web browser e.g Firefox is made up of a browser engine. There are three main ones in use, Blink powering Chromium based browsers (Chrome, Brave, Edge ), Webkit powering Safari, and Gecko powering Firefox. A browser engine contains also among other things, a JavaScript Engine. This engine interprets JavaScprit code and therefore makes it possible to run JS in the browser. Hence is it that JS is the so called language that runs in the browser. The JavaScript engine in Chromium is called V8 (after the car engine), while that in Gecko (Firefox) is called SpiderMonkey. When new functionality is added to JS, the JS engine must be updated to be able to use them. This is called implementing the standard .

This guide is for implementing a standard to be added to SpiderMonkey (Firefox)

## Getting the Firefox Souce Code
Before you can develop on Spidermonkey you must get the firefox code. 

There are instructions here on the Firefox page. 

There are also some instructions for using GIT

## Implementation

### What it does
### Preference

The first thing is to add a preference for the web standards. This "allows for the feature to be enabled or disabled at runtime". I think of this as adding a switch. Essentially we want to be able to turn the feautre off. 

There is a file named `StaticPrefList.yaml`. There you add a new preference. I placed it in the `NIGHTLY_BUILD` part because initially it will only be in nightly builds. 

Make the following changes

- change the name of the preference

Then in JS shell 
- change it to your preference

Build again and run tests. 

### 2. Add a Placeholder Implementation

First test and see that your build is working. 

Now you go to the relevant C++ file and add a placeholder method for the function. We will, again use, NIGHTLY BUILD and return `false` meaning the method will fail for the time. 

```cpp
#ifdef NIGHTLY_BUILD
static bool joint_iterator(JSContext* cx, unsigned argc, Value* vp) {
    return false
}
```

Then we add it to a list of mehthods on the relevant Object, at the endo fo the list. 


And finally, we remove it from the Math object when the preference (pref) is not enabled. 

Then we build, and test. 