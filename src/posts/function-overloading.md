---
title: "Function Overloading"
date: "2024-03-01"
urlPath: "function-overloading"
categories: 
  - "TIL"
tags: 
  -  programming
  - "javascript"
  - "daily-tip"
---

Function overloading is when two or more functions have the same name but different parameters.

Example:

In the HTML spec the Canvas method `isPointinPath` is overloaded:

```
The isPointInPath(x, y, fillRule) method steps are to return the result of the is point in path steps given this, null, x, y, and fillRule.

The isPointInPath(path, x, y, fillRule) method steps are to return the result of the is point in path steps given this, null, x, y, and fillRule.
```

