---
title: "The Kindle Highlights Extractor tool (Part 2)"
urlPath: "kindle-highlights-tool-2"
date: "2020-08-11"
categories: 
  - "software-development"
tags: 
  - "javascript"
  - "programming"
  - "projects"
coverImage: "kindle-e1613119249898.jpg"
---

Yesterday [I wrote about a tool I'm building](https://tawanda.dev/posts/2020-08-10-building-my-first-app-a-kindle-reader-highlights-extractor-part-1/) to automatically sort through and export my Kindle Paperwhite clippings. I've since made progress as I'll detail here.

## Opening a txt file in Node

I used node's filesystem module to open the txt file. It's pretty straightforward as shown below:

```
const fs = require('fs');
fs.readFile('./test.txt', 'utf8', (err, data) => {
    let file = data;


}
```

The first line imports the module and assigns it the name 'fs'. The second line uses the readFile method to open the file. The three arguments passed to the method are the path of the txt file ('./test.txt') (it's located in the same folder for easy testing), the character encoding used (utf8), without which the output would be gibberish, and the callback function with two parameters, err for when the file cannot be opened/found and data which is what's returned if the operation is successful. The last line simply reassigns the data to a new variable named file. (Why did I do that?).

That's all there is to it. I may have to specify what happens if err is returned but there'll be time enough for that.

## Working on the file

At this point the quotes were stored in a giant string named **file**. So I figured I might as well split them into individual quotes. For this I used split.

```
highlights = file.split('==========');
```

This works because all the highlights are demarcated by ten equal signs. In JavaScript the split method takes in the character(s) where the string is to be split and returns an array of substrings.

The returned array, named highlights, would therefore contain a number of substrings equal to the number of highlights in the original clippings document

```
[
  '﻿Mirrors (Eduardo Galeano)\r\n' +
    '- Your Highlight at location 4481-4481 | Added on Wednesday, 6 November 2019 13:36:03\r\n' +
    '\r\n' +
    '“War is God’s way of teaching us geography.”\r\n',
  '\r\n' +
    '﻿Mirrors (Eduardo Galeano)\r\n' +
    '- Your Highlight at location 4879-4879 | Added on Wednesday, 6 November 2019 17:45:36\r\n' +
    '\r\n' +
    'To be natural and clean, like the water we drink, love must be free and mutual. But men demand obedience and deny pleasure.\r\n',       
  '\r\n' +
    '﻿A Brightness Long Ago (Guy Gavriel Kay)\r\n' +
    '- Your Highlight at location 214-214 | Added on Sunday, 10 November 2019 14:25:42\r\n' +
    '\r\n' +
    'We make our own choices sometimes, sometimes they are made for us.\r\n']
```

At this point I could loop through the whole array and extract the relevant details of each highlight using a simple for loop:

```
for( let i = 0; i < highlights.length; i++) {
        highlight = highlights[i].split('\r\n');
        highlight.filter(e => e.length);

        bookDetails = highlight[0];
        quote = highlight[2];


        ...
}
```

The code snippet above shows how I looped through the highlights and split them whenever I found a new line. I had seen that each highlight had the book name and author on one line, the details of the clipping on another and the clipping itself on a different line. This however also created some empty arrays both before and after the main details I wanted so I used filter() to remove all empty arrays.

In the end I was only left with three substrings per highlight array:

- Index 0 (**bookDetails**) which contains the name of the book and the author
- Index 1 () not used (contains the details of the clipping)
- Index 2 (**quote**) the actual highlighted text

(_I think there are better ways of doing this, perhaps using regular expressions. Someday, armed with more knowledge I will refactor. Also I didn't bother using the highlight's other data, or even get the author. Again I will have to fix this at some point in the future_)

The next step was to figure out how to store this information. I decided to make each **book** an object with two (for now) properties - the book details, and an array containing all the quotes. These objects would be stored in an array I named **books**:

```

        function Book(details, quote) {
            this.bookDetails = details,
            this.quote = [quote]
        }

        if (!books.length) { 
            book = new Book(bookDetails, quote);
            books.push(book);
        }
        else { 
            searchBooks(books, bookDetails);

            if ( bookIndex >= 0) {
                books[bookIndex].quotation.push(quote);
            }
            else {
                book = new Book(bookDetails, quotation);
                books.push(book);
            }
        }
```

The code above does several things. Firstly the constructor function **Book** takes in two parameters- the details of a book, and the quote -and uses these to make a new object.

Secondly the if statement checks if the array **books** is empty. _(At first loop it is always empty. Have to make this more elegant_). If the array is empty a **book** object is instantiated using the **Book** constructor. This new object is pushed into the empty array.

If the array is not empty the **searchBooks()** function is called. Defined in the global scope, this function checks if an object of a book of that title already exists in the **books** array.

If the book exists it returns the index of that book, and if a book does not exist it returns -1. (_Again this feels very clumsy_). I have done this because I know I will need to search through the books at some point (_I will likely have to refactor this function_) The **searchBooks** function is shown below:

```
 function searchBooks(arr, title) {
        for(let i = 0; i < arr.length; i++) {
            if (books[i].bookDetails === title) {
                bookIndex = i;
                return;
            }
        }
        bookIndex = -1;
    }
```

If the book exists I simply want to push a quote to the book's quote property's array.

In case the book does not exist (ie **searchBooks()** returns -1) I want to create a new **book** object and push it to **books**.

This process is run inside a loop until all the highlights are assigned to a **book**, and every book object is inside the **books** array.

## Final Words

At this point I have an array called **books** that contains objects representing every book. Each **book** object has two properties, the details of the book ( title and author) and an array called **quotes** containing all the clippings of that book.

My primary objectives are almost achieved. I could use this tool to print out all the highlights from a particular book with a few lines of code.

However I need to make it easier to use without writing any code, and also to perhaps make the code a little bit cleaner. So I need to figure out how to make a Graphical Interface that automatically lists all the books in the clippings and allows easy exporting.

That's tomorrow's task.

See you
