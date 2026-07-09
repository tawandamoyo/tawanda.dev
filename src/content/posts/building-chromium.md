---
title: "Building Chromium on Ubuntu (and a slow network) in 2024"
urlPath: "building-chromium"
date: "2024-04-05"
categories: 
  - "browser development"
  - "software-development"
  - "open source software"
tags: 
  - "chromium"

---

## Introduction
Browsers are my favorite piece of software, and I've always wanted to learn how they work and also (hopefully) contribute. 

This post is about setting up a chromium build for development. It details my experience downloading and building the Chromium source code on a (somewhat underpowered)  Ubuntu laptop over a (somewhat) slow network. 

Below I detail the experience, starting with the technical specs of my laptop and network, then proceeding to the process of downloading and building the source code. 

## Technical Specifications
### PC
My PC is a Dell Latitude 5480 which I got second hand in 2021. As far as I can tell it's from 2019. It came with 8 gig RAM which I have upgraded to 16 Gig.

```
Model: Dell Latitude 5480
RAM: 16 Gig
Storage: 256 Gig SSD [130 Gig Free]
OS: Ubuntu 20
```

### Network Speed
I use a fiber connection that's decent (by our standards). Before I started I measured the network speed using both [measurement lab speed test](https://speed.measurementlab.net/) and [Netflix's fast.com](https://fast.com).

**Measurement Lab**:

**Fast.com**

## Getting the source code
The instructions for building Chromium on Linux are found at [Checking out and building Chromium on Linux](https://chromium.googlesource.com/chromium/src/+/main/docs/linux/build_instructions.md). They are pretty straight forward, and I did not experience any problems.

### System Requirements
Google lists 3 requirements:
- A 64 bit machine with at least 8 GB of RAM. 16 GB is highly recommended. &check;
- At least 100 GB free space &check;
- Git and Python v3.8+ installed (and `python3` must point to a Python v3.8+ binary) &check;

I could use more RAM and storage, but what I have suffices. We proceed. 

### `depot_tools`
The first thing is to get `depot_tools`[^1], and then add it to `PATH`

```bash
git clone https://chromium.googlesource.com/chromium/tools/depot_tools.git
```

then

```bash
export PATH="/path/to/depot_tools:$PATH"
```

There were no problems here.

### The Chromium source code

Then create a `chromium` directory and then change into it:

```bash
mkdir chromium && cd chromium
```

Then fetch the code using `fetch` from `depot_tools` to checkout the code and its dependencies:

```bash
fetch --nohooks --no-history chromium
```

Using the `--no-history` flag to omit the repo history, which according to the instructions can "save a lot of time".

The instructions says this will take about "30 minutes on a fast connection, and many hours on slower ones."

On my setup it took 43 minutes. The downloaded `src` folder was 18.8 GB.

Change into `src`. All subsequent instructions assume you have switched into source:

```bash
cd src
```

#### Install additional dependencies

Run 

```bash
./build/install-build-deps.sh
```

#### Run Hooks
This runs Chromium -specific hooks which downloads other required stuff

```bash
gclient runhooks
```

This command took 40 mins, adding about 6.5 GB to the `src` folder which grew to 25.3 GB. 

### Setting up the build
Now, the exciting part - the build. Chromium uses a build system called [Ninja](https://ninja-build.org) alongside a tool called GN to enerate the `.ninja` files. 

So first, I created a build directory:

```bash
gn gen out/Default
```

This needs to be run only once for each new build directory. There are also other options that I don't understand. 

### Building Chromium

I then built Chromium with

```bash
autoninja -C out/Default chrome
```
My laptop's fans started whirling, and CPU usage went way up. Using `top` I saw that the build basically took over the machine.

[top stats]()

This command takes a loooong time. It's Friday afternoon so I went out for a beer.


## Running Chromium

After coming back in the evening Chromium was finally built. The terminal tells me it took 6 hours. 

The chromium folder had balooned to 70 GB. 

I then ran Chromium with

```bash
out/Default/chrome
```
 and voila, I had my brand new instance of Chromium, straight from the source (but without some Google services and such)

 ## Final words

 So there it is. I have successfully built Chromium. Here are some key stats/takeaways:

 ```
 Total time: 

 ```

 There is also a section for faster builds that I mostly don't understand. Some of it involves limiting debug logs and other very-advanced-stuff. Not my concern at the moment. 

## Next steps
The next step is to hack on Chromium of course. There is already a bug I want to work on that's related to my interest in [web standards](). But I don't know any C++ so I will grab a copy of [Learn C++ in a weekend]() and see how far I can get.

[^1]: I'm not sure what it does 
