---
title: Async/Await vs Promises
date: "2020-12-12"
description: A few difference.
isDraft: true
---

## Error handling

1. Promises

```javascript
export const makeRequest = () => {
  try {
    getJSON()
      .then(res => {
        const data = JSON.parse(res) // this parse may fail
      })
      .catch(err => {
        // parse error can be cought here
        console.log(err)
      })
  } catch (err) {
    // parse error cannot be cought here
    console.log(err)
  }
}
```

2. Async/Await

```javascript
export const makeRequest = async () => {
  try {
    const res = await getJSON()
    const data = await JSON.parse(res) // this parse may fail
  } catch (err) {
    // parse error can be cought here
    console.log(err)
  }
}
```
