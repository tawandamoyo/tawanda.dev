---
title: "How to count the occurrence of array elements in JavaScript"
date: "2022-11-07"
urlPath: "how-to-count-occurrence-array-elements-javascript"
categories: 
  - "TIL"
tags: 
  - "javascript"
  - "daily-tip"
---

Suppose you have an array of items, say pizza toppings, as below:

```javascript
const toppings = ['anchovy', 'chilli', 'ham', 'bacon', 'ham', 'calamari', 'bacon', 'chicken', 'cheese', 'pineapple', 'ham', 'anchovy', 'cheese']
```

Perhaps you want to store the number of toppings in a database, or use the count of each topping to calculate a price. In either case you want to find how many occurences of each topping there are in the array.

To do this you create an empty object, then loop through the array and each time check if the array element exists as a property name in the object. If it exists you increment its value by one, and if it does not exist you create it and give it an initial value of one.

```javascript
let count = {};

for (let topping of toppings) {
	if (count[topping]) {
		count[topping] += 1;
	} else {
		count[topping] = 1;
	}
}
```

now  if you log out `count`, you will get the following:

```javascript
console.log(count);

/*
{
  anchovy: 2,
  chilli: 1,
  ham: 3,
  bacon: 2,
  calamari: 1,
  chicken: 1,
  cheese: 2,
  pineapple: 1
}
*/
```

You can now query the properties of this object to get the count of each element.

## Extras

The `Object.keys()` method will return an array of the enumerable property names of an object. Because the `count` object now has unique properties, you could use `Object.keys(count)` to get an array of the toppings:

```javascript
console.log(Object.keys(count));

/*
[
  'anchovy',  'chilli',
  'ham',      'bacon',
  'calamari', 'chicken',
  'cheese',   'pineapple'
]
*/
```

You can also get the same array of unique elements by using the `Set` method

```javascript
let uniqueToppings = [... new Set(toppings)];

console.log(uniqueToppings);

/*
[
  'anchovy',  'chilli',
  'ham',      'bacon',
  'calamari', 'chicken',
  'cheese',   'pineapple'
]
*/
