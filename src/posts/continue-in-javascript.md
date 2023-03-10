---
title: "Continue in JavaScript"
urlPath: "continue-in-javacript"
date: "2023-01-15"
categories: 
  - "TIL"
tags: 
  - "javascript"
  - "daily-tip"
  - "disruption"
---
## The `continue` keyword

The `continue` statement is part of JavaScript's disruptors- statements that change the control flow of a program, together with `break`, `throw` and `return`.

`continue` influences the progress of a loop and can only be used within the body of a loop. When `continue` is encountered in a loop body, control jumps out of the body and continues with the loop's next iteration. It is similar to `break` except that instead of exiting the loop it restarts the next iteration of the loop.

Depending on the type of loop `continue` does different things: in a `while` loop it returns directly to the condition, while in a `for` loop it evaluates the _increment_ (or _decrement_) condition and then returns to the condition.

## Motivation

Today as I refactored my [Kindle Klipper](https://github.com/tawandamoyo/KindleKlipper) app I encountered a bug that I later discovered arose because one of clippings was not a highlight but a bookmark. As a result it added `undefined` to the array of highlights and caused an error when the program tried to write to the output folder.

I tried several solutions to get around this, but eventually the simplest was to just use `continue` to skip that particular clipping during parsing as follows:

```js
for(let i =0; i < clippings.length; i++) {
    if (!highlight) {
        continue;
    }
}

```

Some do not consider this an elegant solution, as the very opinionated Douglas Crockford writes in _How JavaScript Works_:

<blockquote>The continue statement is a goto statement that jumps to the top of a loop. I have never seen a program that contained continue that was not improved by its removal.</blockquote> - How JavaScript Works
