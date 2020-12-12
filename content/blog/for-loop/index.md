---
title: for...in and for...of
date: "2020-12-10"
description: FSR.
---

```javascript
const arr = [3, 5, 7];
arr.foo = 'hello';

for (let i in arr) {
  console.log('for...in', i); // '0', '1', '2', 'foo'
}

for (let i of arr) {
  console.log('for...of', i); // '3', '5', '7'
}
```

```javascript
const colors = ['red', 'green', 'blue'];

for (let index of colors.keys()) {
  console.log(index);
}

// 0
// 1
// 2

// default
for (let index of colors.values()) {
  console.log(index);
}

// red
// green
// blue

for (let index of colors.entries()) {
  console.log(index);
}

// [0, 'red']
// [1, 'green']
// [2, 'blue']
```

```javascript
const colors = new Set(['red', 'green', 'blue']);

for (let index of colors.keys()) {
  console.log(index);
}

// red
// green
// blue

// default
for (let index of colors.values()) {
  console.log(index);
}

// red
// green
// blue

for (let index of colors.entries()) {
  console.log(index);
}

// ['red', 'red']
// ['green', 'green']
// ['blue', 'blue']
```

```javascript
const values = new Map([
  ['key1', 'value1'],
  ['key2', 'value2']
]);

// default
for (let [key, value] of values.entries()) {
  console.log(key + ':' + value);
}

// key1:value1
// key2:value2
```
