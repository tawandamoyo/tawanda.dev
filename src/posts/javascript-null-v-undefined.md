---
title: "Null v Undefined in JavaScript"
date: "2023-01-12"
urlPath: "javascript-null-v-undefined"
categories: 
  - "TIL"
tags: 
  - "javascript"
  - "daily-tip"
  - "empty values"
---
JavaScript provides two special values that are used to denote the absence of a meaningful value: `null` and `undefined`. These so called _empty values_ (or _bottom values_) are themselves values but carry no information.

While the primitive types `null` and `undefined` are often interchangeable, the prevailing consensus is to use  `undefined` in most cases. This leads to more consistent code and also means you don't have to check whether a condition satisfies both of them.

<blockquote>"...it’s safest and best to use only undefined as the
single empty value, even though null seems attractive in that
it’s shorter to type!"</blockquote> - Kyle Simpson, *You Don't Know JS Yet*

<blockquote>"We can make better programs if we eliminate wun of them. We can not eliminate wun from the language, but we can profitably eliminate wun from our own programs. We should eliminate `null` and use `undefined` exclusively." </blockquote>  - Crockford, *How JavaScript Works*

There are, of course, exceptions (in JSON or to create a new empty object with `Object.create(null)`) but that probably means you know what you are doing.

So, in summary, use `undefined` most times. Use `null` only when you have reasons not to use `undefined`.
