---
title: "The Right Tools Make for A Better Web Experience"
urlPath: "right-tools-better-web"
date: "2021-03-15"
categories: 
  - "software-development"
---

Today I had to deploy a quick landing page for a client. I opted to use WordPress because I thought it would take the shortest time. Mistake.

Installing WordPress itself took less than the famous five minutes, but I soon ran into problems. First after installing the Divi theme I got the dreaded: "There has been a critical error on this website."

I purged the database, reinstalled WordPress, and everything seemed to work well. Then I customized the site a little and tried to test it using different browsers and devices. For some reason I could not see any images when I visited the site using Firefox and Brave. Same story on the mobile version of Chrome. And the site took ages to load.

What should have been a quick job, perhaps a few hours, turned out to be a wasted afternoon spent trawling through WordPress forums, going back and forth with the hosting providers and countless installations and uninstallations of various themes and plugins.

In hindsight I should have just spinned up a quick template using pure HTML and CSS and maybe a bit of JavaScript. That would have delivered a lightweight and secure site that would have worked on different devices without any problems and without needing to be updated.

Instead of saving time I ended up spending way longer on debugging WordPress than I might have spent writing custom code. I am still at it. I chose the wrong tool for the job.

I love WordPress, don’t get me wrong, after all it is the platform that got me into software development, (and this site runs WordPress) but I now understand why it gets such bad rep. The platform is a mess.

And it’s not only WordPress. It’s basically every application and website out there. Lots of JavaScript, fonts, libraries and countless other external ( and internal) scripts and files.

Such is the state of modern web development: bloated themes, frameworks and libraries all doing what simple HTML and CSS can do in a more elegant and cleaner way. Not to mention other benefits like faster load times and security.

I think one reason why a lot of people use WordPress is its ease of deployment. There are thousands of themes out there, many of them free, and most hosting providers have tools that automate the WordPress installation. There are also countless plugins for doing virtually whatever a user wants. This is why WordPress is so powerful - it offers everyone a quick and easy way to deploy a website and that’s a good thing ( thanks Matt).

But this is the source of most of WordPress’ problems as well. The commercial themes that try to do everything are often bloated, slow and vulnerable to attacks.

It is clear to me now that while WordPress, React, and other buzzwords, are useful, it is possible that we are misusing these tools. In most cases they are overkill. They are the wrong tools for many jobs.

\-------------------

I have been reading [_High Performance Browser Networking_](https://hpbn.co/), and the point stressed throughout the book is that users expect quick loading sites. While the bottlenecks on fast delivery are often physical, i.e, the communication links, the network design, latency etc, the apps themselves can be bloated. 

In Zimbabwe the internet is slow (as in most of Africa), and it dawned on me that I should be more mindful of the loadtimes of the websites I make. A big part of that, I think, is staying clear of most modern frameworks and tools.

This morning in my Feedly there was an article about web performance titled “[The Performance Inequality Gap”,](https://infrequently.org/2021/03/the-performance-inequality-gap/) which, among other things, pointed out that while phones have gotten more powerful, the average size of a web page has increased as well. It didn’t strike me then that I am part of the problem.

Engineering, like Economics, is a discipline of constrained optimization. 

Choosing the right tool is an essential part of the job and if we are to provide a joyful experience to the many internet users who have slower phones and even slower internet, perhaps we should spend more time thinking about the tools we use for the job.
