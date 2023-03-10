---
title: "Fixing Monitor Resolution Part 2: Automating a Shell Script"
urlPath: "fixing-monitor-resolution-2-shell-scripting"
date: "2021-01-07"
categories: 
  - "software-development"
tags: 
  - "linux"
  - "shell"
coverImage: "linux.jpg"
---

Turns out writing a shell script is not that difficult if one is familiar with other programming languages. With the help of this brilliant [Shell Scripting Tutorial](https://www.shellscript.sh/index.html) I managed to write a simple script.

First I created the file, called screen\_res.sh:

```
nano screen_res.sh
```

This creates the file and opens it using the Nano editor. I then wrote the lines below in the file:

```
#!/bin/sh
xrandr --newmode "1920x1080_60.00"  173.00  1920 2048 2248 2576  1080 1083 1088>
xrandr --addmode VGA-1 1920x1080_60.00

```

The program is simply [the commands I ran in the last tutorial](https://tawanda.dev/fixing-monitor-resolution-on-ubuntu/) with the exception of the first line. I ommitted the cvt command because I already know the modeline of the display I need.

Those familiar with other programming languages might (correctly) guess that the pound symbol, #, implies a comment in Shell, as it is in Python and other languages. It does, except when it is the first line of the program, and is followed by !. In this case it means that the program is to be executed by the Shell. Similarly a program to be run by Python might have #! /usr/bin/python as a first line.

It is also required to make the file an executable. To do that the permissions on the file should be changed. Using chmod, which changes file permissions:

```
chmod a+arx screen_res.sh
```

Running the script is as simple as:

```
./screen_res.sh
```

To test the program I restarted my PC, navigated to screen\_res.sh and ran the script and it immediately fixed the display.

## Automatically Running the Script

Now that I had saved myself some typing, I wanted to save myself even more time by automating the running of the script.

A bit of research showed that I could use two methods:

1. Setting up a cron job to run the script at specific times eg at boot
2. Copying the file to ~/etc/profile.d

I tried the first option but it did not work. A little Googling showed that cron jobs may require sudo access in Ubuntu. I will have to explore that at a later day I guess.

The second option is quite straightforward, using the command line I simply copied the file to the etc/profile path:

```
cp screen_res.sh ~/etc/profile.d
```

I restarted my PC and it worked like a charm.

So that's it. I saved myself a minute or two of typing every time I reboot my PC and learnt a lot in the process.
