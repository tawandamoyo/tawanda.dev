---
title: "Contributing to OSS (Matrix) as a Newbie"
urlPath: "contributing-to-oss-matrix"
date: "2022-06-15"
categories: 
  - "software-development"
  - "open source software"
tags: 
  - "Matrix"
  - "Git"
---

I recently made a contribution to an open source project called [Matrix](https://matrix.org). As a new contributor to the project and someone just getting started in the Open Source world, it was daunting but it turned out to be easier and more approachable than I had imagined.

## What is Matrix?

Matrix is an open source project that publishes the Matrix open standard for secure, decentralized, real-time communications. While that sounds complicated it basically comes to down to having control over our communications and removing the need for a ton of apps to manage real time communications on the internet.

With Matrix you can have a single application that connects to different services using what are called Bridges and you host your own communication, or choose someone to host for you. You could, for example, use one app to communicate on WhatsApp, Signal, Telegram and Messenger.

There are plenty of clients you can choose to use with Matrix such as [Element](https://element.io/) Hydrogen, Nheko and others.

## The Problem

There was a bug on the Matrix website homepage. There is an animation there showing how Matrix works and users were unable to select text on the panels accompanying the different animation frames.

Here is what the original issue report said:

"_In the text panels explaining each part of the `How does it work?` animation, each text panel is positioned/stacked on top of each other and is only hidden by `opacity: 0;`. So you're unable to select any text on any of the panels except the last one._"

The Matrix website is made with Gatsby which is a React based framework for static websites. I wasn't familiar with Gatsby but I use a static site generator (Eleventy) for this website and I know some JavaScript so I decided to jump in.

## The Solution

I had already cloned the repo and set up a local dev environment following the instructions in the README.md file so what was left was to find the code for the animation.

Searching through the codebase I found the relevant file that controls the animation to be `gatsby/static/how-it-works.js` which has a function called `nextStage` which controls the animation.

Below is the relevant code snippet of `nextStage`:

```js
d3.select("#legend" + stageIndex).style("opacity", 1)
    .transition()
    .duration(dissolveTime)
    .style("opacity", 1e-6);
d3.select("#legend" + (stageIndex + 1)).style("opacity", 1e-6)
    .transition()
    .duration(dissolveTime)
    .style("opacity": 1);
```

The code selects an element with `id` of `legend` concatenated with `stageIndex` which is just the stage number of the animation, gives it `opacity: 1` to make it visible, applies some transition to it, and when done gives it a negative opacity to hide it from view. Then when the next stage of the panel is selected, it starts with a negative opacity (since it's originally hidden) transitions into view and is then given an opacity of 1, to make it the visible.

The fact that the panels are stacked on top of each other, and the current one only invisible because hidden ones are assigned negative opacities, made the text unselectable.

## The first PR

My first idea was to change the display property of the hidden panels to `display: none` as this would hide the panels from the document flow instead of just making them transparent as opacity does.

I updated the code, gave it a look, saw that it "worked" and sent in a Pull Request. However the PR was not good enough. While it "solved" the problem it also introduced another that I did not notice - it removed the transition between the animation texts.

## The second PR

After a very helpful review by one of the more experienced maintainers, I tried a second solution. 

The solution here was to assign `pointer-events: none` to the hidden panels. This maintained the negative opacity of inactive panels, but allowed users to click through them.

Here's how the code now looked like:

```js
d3.select("#legend" + stageIndex).style("opacity", 1)
    .transition()
    .duration(dissolveTime)
    .style("opacity", 1e-6);
d3.select("#legend" + (stageIndex + 1)).style("opacity", 1e-6)
    .transition()
    .duration(dissolveTime)
    .style({ "opacity": 1, "pointer-events": "auto" });
```

I then used Git to rebase my commit, edited the commit message, pushed my changes and requested another review. 

This time the solution was accepted and merged.

## Lessons

I've learnt a few things about contributing to OSS and working in teams in general. Here are a few of them:

1. Read the README.md
	- Most projects come with a README.md file that contains instructions on how to set up the project, make contributions etc. Reading this file makes it so much easier to get up and running.
	- Additionally if the README is not clear in some areas or you run into issues while following the instructions that's actually a potential contribution.
2. It's easier when you use the product.
	- Fixing bugs is so much easier when you use the product. You will have a better understanding of the problem.
	- In this case it was easy to see the problem since all I had to do was go on the Matrix homepage and try to select text.
3. Ask/ Communicate a lot
	- Communication is important, especially when you are just starting out. I asked for a review in the Matrix.org homeserver and I got help and useful feedback quickly.
	- People are more willing to help than we imagine. I think this is a helpful principle for life in general. In Shona we have the proverb, _"Mwana asingachemi anofira mumbereko"_, which translates to "The child who doesn't cry dies in the baby sling". Or as the English say, "Closed mouths don't get fed."
4. Research
	- This is really a rehash of (2). There are a lot of answers already on the internet. An underrated skill is knowing how to ask the right questions. I ended up knowing quite a bit about opacity and some other CSS tricks and tools.
5. Git is your friend
	 - Git is intimidating to beginners but it's a great tool for dealing with software and I learnt a lot of it because of this one commit.
	 - After my first commit required changes I had to edit my commit history, and this led me to `git rebase` . All in all I learnt a lot about the workings of Git that I am sure will be valuable in other areas.

## Conclusion

I am really happy with how this turned out. I made a (minor) contribution to one of my favorite OSS projects, got really good feedback and honed my software engineering skills in the process. 

I hope my experience inspires other newbies to contribute to Open Source Software. Also, if you do not already, do check out the Matrix protocol. It's cool and interesting and I honestly think it's the future.