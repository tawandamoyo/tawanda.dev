---
title: "The tee command"
date: "2024-03-11"
urlPath: "tee-command-linux"
categories: 
  - "TIL"
tags: 
  - "linux"
  - "bash"
---

The `tee` command in Unix (and other platforms [^1])

> The `tee` command copies standard input to standard output and also to any files given as arguments.
>  

&emdash; <cite>[GNU documentation](https://www.gnu.org/software/coreutils/manual/html_node/tee-invocation.html)</cite>

If the file being written to does not already exist, it is created. If the file exists its data is overwritten unless the `-a` option is used.

It's interesting that the command is named after a T splitter used in plumbing.

---
_Motivation_:

One of the commands in the setup of a local environment for [web platform tests](https://web-platform-tests.org/running-tests/from-local-system.html#system-setup) has the `tee` command.

```bash
./wpt make-hosts-file | sudo tee -a /etc/hosts

```

The output of `./wpt make-hosts-file` is output to the console and also written to `/etc/hosts` but without overwriting the data already in that file.


[^1]: Wikipedia says the command is available on DOS, WIndows and ReactOS.