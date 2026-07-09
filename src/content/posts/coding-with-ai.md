---
title: "Coding with AI (Claude)"
urlPath: "coding-with-ai"
date: "2024-09-26"
categories: 
  - "Artificial Intelligence"
tags: 
  - "javascript"
  - "programming"
  - "ai"
---

Lately I have been using AI to assist in programming. This has been very useful for quick prototyping, creating boilerplate, and just to overcomet the stasis of starting new work.

My go to large language model (LLM) is Anthropic's [Claude 3.5](). I find it to be superior to the Chat GPT 4 variants, though on occasion I use Chat GPT, especially after I run out of the free tokens on Claude. (By the way I think the flat pricing without regard to earnings or geographical location exclude many people esp in the global south from the productivity gains that come from AI)

Today I encountered a very minor bug that I figured out in about 2 seconds of looking at the code. All I had to do was delete a word. 

I pasted the following section of the code into Claude and gave it the following prompt:

"In the code below, the displayed date has duplicate phrasing, for example an output says 'takes 3 minutes seconds' instead of just saying 'takes 3 minutes'. Help me debug, as an experienced developer."

```js
// Use moment to format to "5 minutes and 30 seconds"
  const averageTime = moment.duration(averageSeconds, "seconds").humanize();

  return (
    <div>
      <>
        <p>
            This usually takes around {averageTime} seconds, but may take longer.
        </p>
      </>
```

Claude says:

```txt
I see the issue. The problem is likely occurring because you're using moment.duration().humanize(), which can sometimes lead to awkward phrasing, especially with durations that include both minutes and seconds.
To fix this, we can create a custom function to format the duration more precisely. Here's how we can modify the code to address this:

```

and proceeds to define a new function to include in the code.

While the generated code works, it is clear from reading the code that the actual bug is due to the substring "seconds" in the <p> tag. The solution is simply to delete it. 

It struck me then that while generative AI might be somewhat decent at adding code, it's less so at removing code. 

And it seems to me that part of coding is also removing stuff, not only adding.

---
_Addendum_
- I ended up using a method similar to what Claude suggested, where I defined my own custom function but I did this because `moment.js` is no longer maintanained. 
- In any case, the Claude solution still used `moment.js` but with additional wizardry. 
