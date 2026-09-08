---
title: "Seeing Bugs"
urlPath: "seeing-bugs"
date: "2026-09-08"
kind: "essay"
description: "I now see more bugs and inconsistencies everywhere. I attribute this newfound perceptivity to Dan Luu, and two books I recently read."
categories:
  - "software"
tags:
  - "bugs"
  - "software design"
  - "user experience"
  - "books"
---

Dan Luu has an interesting [essay](https://danluu.com/bug-blind/) where he writes that he sees bugs everywhere; and that he's often surprised by other people's inability to see bugs, what he calls "bug blindness". 

I do not notice bugs as much as he does - he claims he encounters hundreds every week - but since last week I certainly notice more bugs and inconsistencies than I used to. I attribute this newfound perceptivity to Dan Luu's essay and two books I read recently - _Don't Make Me Think_ by Steve Krug, and Bruce Schneier's _A Hacker's Mind_. 

_Don't Make Me Think_ is a short guide to creating better designs. The main idea is that good design should be intuitive, with very little thinking required of the user. A user should use a product with as little cognitive load as possible. _A Hacker's Mind_, on the other hand, is about the hacks that are present in everyday systems - the tax code, the legal system, computer systems, social systems, financial systems, and so forth. Both books encourage paying a little bit more attention to things that we often take for granted. 

For example this morning I tried to log into my DeepSeek account which I hadn't used in ages. I'd forgotten the password and I wanted to reset it. But I also wasn't sure which email I signed up with. So I used the email I use most often, and received a reset code. When I attempted to use this code I received an error message that said the email was not registered on the platform. I retried with another email and that one worked. 

This is inconsistent with how most web platforms work. The standard way is that if an email is not in the database it doesn't get a reset code.  If any email in the world can be sent a DeepSeek reset code regardless of whether that email has an account associated with it or not this can easily turn into a spamming activity. 

Would I have noticed this prior to reading _Don't Make Me Think_ and Dan Luu's essay? I doubt.

I find that I agree with Dan Luu that there are a lot of bugs and inconsistencies in any software (and consequently exploits). After all software is really just an abstraction of the real world implemented via the programmer's own theory of that real world. Yet all [abstractions are leaky](https://www.joelonsoftware.com/2002/11/11/the-law-of-leaky-abstractions/) and so it seems to me that there will always be some edge cases that cannot be codified, at least not on a level that makes economic sense. 

If _all_ software is bug-ridden we either don't notice the bugs or we ignore them and try something else. 

Krug points  this out in his book - users rarely use software the way its designers imagine they will, they just sort of stumble along, trying out what they think should work. If something doesn't work they might try again - for example by navigating to the home page and trying again - and if too many things dont work, or the time cost is too high, they might abandon the task altogether. 

So there will always be bugs. And some people, whether by disposition, training, or habit will see more of them than others. 