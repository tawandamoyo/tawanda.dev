---
title: "Run the last command as sudo"
date: "2024-04-23"
urlPath: "run-last-command-as-sudo"
categories: 
  - "TIL"
tags: 
  - "linux"
  - "bash"
---

In Unix systems some commands require root privileges, i.e they should be run with `sudo`. It sometimes happens that you forget to use `sudo` or you don't know that the action requires root priviledges, and it can be tedious to retype the entire command. 

The solution is to simply run:

```bash
sudo !!
```

This will run the last command, _but as root_.
