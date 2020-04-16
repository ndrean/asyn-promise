https://fetch-cache.surge.sh

Source:

- https://web.dev/promises/
- https://developers.google.com/web/ilt/pwa/caching-files-with-service-worker
- https://css-tricks.com/why-using-reduce-to-sequentially-resolve-promises-works/

- https://decembersoft.com/posts/promises-in-serial-with-array-reduce/

## Promise.then().catch() and Async/await/try/catch and cache API

Two versions of fetch. Implemented the cache API (await and then() version)

## Promise.All for parallel fetching

We just call `Promise.all([arrayOfPromises]])`. In our example, we perform an indexed `fetch` on an API. Then we `map` the array of 'usersId' to get a promise and this returns an array of promises.

## Batch fetching

We use the same `Promise.all` but this time we slice the array of 'usersId' into smaller arrays and loop through these subarrays. Here, we indexedFrom the the `newArray = array.slice(startIndex, endIndex)` and execute `Promise.all(newArray)`.

> source: https://www.freecodecamp.org/news/promise-all-in-javascript-with-example-6c8c5aea3e32/

## `new Promise` and `async await` method

## Sequential fetching

Suppose we have a fixed number of tasks/promises. If we simply do `return promise1.then(promise2).then(promise3)`, we can't capture the return values. If we do:

```javascript
return promise1
  .then((result1) =>
    promise2.then((result2) =>
      promise3.then((result3) => [result1, resul2, result3])
    )
  )
  .then((arrayOfResults) => {
    //do something
  });
```

If we have dynamic promises, the idea is to use `reduce()` to collapse the array of promises into a single promise chain.
The initial value will be a promise that immediately resolves into an empty array: `initialPromise = Promise.Resolve([]`), so `promiseChain === initialPromise` on the first time through the function.

```javascript
return [task1, task2, task3]
  .reduce((promiseChain, currentTask) => {
    f(promiseChain, currentTask);
  }, (initialPromise = Promise.resolve([])))
  .then();

function f(promiseChain, currentTask) {
  return promiseChain.then((chainResults) => {
    currentTask.then((currentResult) => [...chainResults, currentResult]);
  });
}
```

## AXIOS and cache in browser (cdn)
