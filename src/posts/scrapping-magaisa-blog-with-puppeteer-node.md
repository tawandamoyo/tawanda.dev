---
title: "Scrapping the Big Saturday Read blog with Puppeteer and Node.js"
urlPath: "blog-scrapping-with-node-puppeteer"
date: "2022-08-13"
categories: 
  - "software"
tags: 
  - "node.js"
  - "puppeteer"
  - "web-scrapping"
---

I have been writing a Node.js scrapper to download blog posts on the website of the late Zimbabwean academic [Dr Alex Magaisa](https://bigsr.africa). I worried that one day the domain and or hosting might expire and we would lose such important, thoughtful, and well written material. I also felt that it would also be my own small contribution to keeping the legacy of that brilliant man alive.

My goal was to get all the posts he wrote and save them as either plaintext files or PDFs.

## Planning

The blog I intended to scrap lives at [https://bigsr.africa](https://bigsr.africa) and is a WordPress site. I googled around a bit and because I am a JavaScript person I decided to scrap the site using Puppeteer which is a Node.js library which provides an API to control Chrome or Chromium. In other words Puppeteer allows us to control a browser with code.

Puppeteer can do most of the things that a human can manually do in the browser including generating screenshots and PDFs of pages, crawling pages, submitting forms and testing Chrome extensions.

It is important when scrapping a website to visit it and look at how the content is structured. My plan was to get all the links to the posts, store them in an array and the loop through the array opening each link one by one and saving the post as a pdf.

All the articles on the website can be found on [https://bigsr.africa/articles](https://bigsr.africa/articles). However there is a challenge. The website uses infinite scroll, which means when you reach the bottom of that page it loads more content and continues like that until there is no more content to load.

Since Puppeteer more or less simulates real browser interaction, it is possible to make it scroll to the bottom of a page, wait for a set time and then scroll again, as a real user might, and I found some interesting implementations on StackOverflow. However the site sometimes didn't finish loading the infinite scroll so I decided to look for another option.

 Fortunately there is an authors page which shows all posts written by a particular author. On Dr Magaisa's blog this is at https://bigsr.africa/author/dr-alex-magaisa. There  are also four other contributors, but they only had a post  each and could be handled separately.

## Project Setup

First I created the project folder and initialized `npm` and `git`:

```bash
mkdir blogscrapper
cd blogscrapper
git init
npm init 
```

Then I installed puppeteer and created a file called `index.js` for the code:

```bash
npm install puppeteer
touch index.js
```

Installing Puppeteer also downloads a version of Chromium that works best best with Puppeteer but it is also possible to install puppeteer without downloading Chromium by installing `puppeteer-core` instead of `puppeteer`.

## Setting Up Puppeteer

As with a normal browsing session, one starts with opening the browser, then navigating to a particular page. In puppeteer this is done as follows:

```javascript
const puppeteer = require("puppeteer");
const fs = require("fs");

const URL = "https://bigsr.africa/author/dr-alex-magaisa"

(async () => {
	const browser = await puppeteer.launch({
		headless: false
	});
	const page = await browser.newPage();
	await page.goto(URL)
	
}) ();
```

The `headless: false` option means Puppeteer will not run headless which is how it works by default. It is also not possible to generate PDFs in this state, but it's useful sometimes especially when writing the code as you can see what is happening. I changed this to `headless: true` when I was done and ready to run the program.

## Getting the links

The author page contains some helpful information, like the total number of posts which can be used to verify the right number of posts and at the bottom it has pagination with the total number of pages.

I needed then to get all the links ( and whatever other info I wanted) on the first page, then go to the next page and repeat, until the last page was reached. Puppeteer has a `click()` method that makes it possible to find and click on DOM elements such as links and buttons and this  can be used to navigate to to the next page of the author archives but given that the url structure of the author page archives follows a simple numeric incremental pattern it made more sense to simply increase the page count by one after harvesting the links:

On each page got the links and pushed them to an array, then concatenated that array with another array created to hold all the links.

### `page.evaluate()`

The `page.evaluate()` method in Puppeteer allows users to run JavaScript on the browser giving access to browser APIs such as `document.querySelector()`. When using `page.evaluate()` you leave the Node.js (Puppeteer) environment and enter the DOM.

```javascript
...
let currentPage = 1;
let pagesToScrape = 44;
let postLinks = [];

// get all links to articles
while ( currentPage <= pagesToScrape) {
	let postLinksOnPage = await page.evaluate(() => {
		let links = [];
		let postDetails = document.querySelectorAll("h3 a");
		postDetails.forEach((post) => {
			links.push(post.href);
		});
		return links;
	});
	postLinks = postLinks.concat(postLinksOnPage);
	if (currentPage < pagesToScrape) {
		await page.goto(`${URL}/page/${currentPage + 1}`);
		page.waitForNetworkIdle;
	};
	currentPage ++;
}
```

After saving and running the code I printed the length of `postLinks` to the console and I saw that there were well over 700 links in the array. The reason was that some links in the footer and sidebars, for example under Most Read, or Most Recent or Related Articles, were duplicated.

So I had to clean up the array and remove duplicates.

```javascript
let postLinks = [... new Set(postLinks)];
```

Now the length of the links array equaled the total number of posts on the author page.

## Getting the posts

With all links stored in an array, the next step was to loop through them, open and then capture the content and save it in a human readable way.

I used `page.evaluate()` to extract the title and date from each article, and then used these to create an output folder to store the pdf articles.

Puppeteer comes with a `.pdf()` method that creates `.pdf` files from the html on a page and I called this to create the page. Once an article is created the page closes and moves on to the next.

```javascript
for (let link of postLinks) {
	try {
		const page = await browser.newPage();
		await page.goto(link, {
			waitUntil: 'networkidle2'
		});

		let postData = await page.evaluate(() => {
			const postTitle = document.querySelector("h1").innerText;
			const postDate = document.querySelector(".td-post-date").innerText;
		
			const dateDetails = postDate.split(" ");
			const month = dateDetails[0];
			const year = dateDetails[2];

			return  {
				title: postTitle,
				month: month,
				year: year
			}
		});

		const outputPath = `bsr/${postData.year}/${postData.month}`;
		fs.mkdir(path, {recursive: true}, (error) => {
			if (error) throw error;
		});

		await page.pdf({
			path: `outputPath/${postData.title}.pdf`,
			format: "a4"
		});

		await page.close();
		
	} catch (err) {
		console.log(err);
	};
}
```

I ran the code, waited for quite some time and voila, I now had a folder called `bsr` which contained the posts as pds in folders organized by year and month.

## Performance and afterthoughts

Running this script took a long time. After all it had to open the author archives pages 44 times, then open 438 pages and capture PDFs. It took well over 50 minutes to scrap the site and save the PDFs.

Additionally the captured PDFs contained a lot of unnecessary content that is part of the page, such as footer content and related articles.

The program is also silent while it's running, giving no clue of what's going on, and given it runs for such a long time this can be problematic.

I'll try to fix these concerns some other time.
