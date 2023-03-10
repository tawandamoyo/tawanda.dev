---
title: "Fixing Monitor Resolution on Ubuntu"
urlPath: "fixing-monitor-resolution"
date: "2020-12-15"
---

When I switched to Linux the resolution of my second monitor dropped for some reason I couldn't figure out (I suspect the $2 VGA cable I bought in downtown Harare has something to do with it). After some Googling I found a way to fix it that involves a few commands:

First run:

```
xrandr --query
```

This shows the names of the different outputs available on the system (VGA, HDMI etc) and the resolutions of each output. For me the problematic monitor was VGA-1, which for some reason defaulted to a resolution of 800x600.

The next step is to find the mode details of the preferred resolution configuration. For me this was 1920x1080.

```
cvt 1920 1080

#output:
#1920x1080 59.96 Hz (CVT 2.07M9) hsync: 67.16 kHz; pclk: 173.00 MHz
Modeline "1920x1080_60.00"  173.00  1920 2048 2248 2576  1080 1083 1088 1120 -hsync +vsync
```

The cvt command calculates the mode lines of a particular resolution given the desired horizontal and vertical resolutions.

The next step is to define a new mode. To do this you run xrandr again, adding the characters after Modeline above as the newmode:

```
xrandr --newmode "1920x1080_60.00"  173.00  1920 2048 2248 2576  1080 1083 1088 1120 -hsync +vsync
```

The new mode must then be associated with a particular display. The details of the displays can be obtained by running xrandr, as I did at the beginning. In my case the display is VGA-1. To add the new mode to the output is trivial:

```
xrandr --addmode VGA-1 1920x1080_60.00
```

These simple steps solve the problem. You must however remember to substitute the display name with that of your own system, as well as the resolution with your desired resolution.

Part 2:

Wait there's a part 2? Yeah there is. The problem is that these configurations are lost every time the computer shuts down or logs out.

So I have to figure out how to permanently keep these settings. Which is what part 2 will be about.
