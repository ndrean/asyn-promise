## Live demo app at:

> https://fetch-cache.surge.sh

Demo of different `fetch` constructions with a public API (endpoint: "https://reqres.in/api/users/") (supporting `CORS` and `https`).
We just render the ids in the browser to view the result of testing some fetch chaining strategies:

- simple loop with 2 construcions (`async/await` and `promise.then()`)
- parallel fetching by using `promise.all()` on an array of promises
- sequential fetching by using `reduce()` on an array of promises
- parallel fetching is then `slice()` to fetch by batch

We also implement caching.

### Sources:

- https://web.dev/promises/
- https://developers.google.com/web/ilt/pwa/caching-files-with-service-worker
- https://golb.hplar.ch/2018/01/A-closer-look-at-the-Cache-API.html
- https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Array/reduce

##

## Versions of fetch promises and cache API

Two versions of fetch:

- `new Promise` with `resolve/reject` and `then()` chaining
- `async await` with `try/catch`.

The `cache API` is also implemented with `await` and `then()` versions

## Promise.All for parallel fetching

We just call `Promise.all([arrayOfPromises]])`. In our example, we perform an indexed `fetch` on an API. Then we `map` the array of 'usersId' to get a promise and this returns an array of promises.

## Batch fetching.

We use the same `Promise.all` but this time we slice the array of 'usersId' into smaller arrays and loop through these subarrays. Here, we indexedFrom the the `newArray = array.slice(startIndex, endIndex)` and execute `Promise.all(newArray)`.

> source: https://www.freecodecamp.org/news/promise-all-in-javascript-with-example-6c8c5aea3e32/

## Sequential fetching

Suppose we have a fixed number of tasks/promises. If we simply do `promise1.then(promise2).then(promise3)`, we can't capture the return values. Then we can do:

```javascript
Promise.resolve()
  .then((r) => {
    return promise1.then((r) => display(...));
  })
  .then((r) => {
    return promise2.then((r) => display(...));
  })
  .then((r) => {
    return promise3.then((r) => display(...));
  });
```

https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Array/reduce

If we have dynamic promises, we put all the promises in an array and use `reduce()` to collapse the array of promises into a single promise chain.
The `reduce()` method executes a provided callback function `callback` which takes the `previousValue` and `currentValue` which iterates over the array. The function stores the result in the `accumulator` which will be the `previousValue`. It uses and initial value. Here, we take `Promise.resolve([])`, a promise that always resolves to an empty array as the initial value. Then `accumulator === initialValue` on the first time through the callback.
We will capture the result in an array, called `arrayOfResults` further used to display the
results in the browser.

```javascript
promises
  .reduce((promiseChain, currentPromise) => {
    return promiseChain.then((result) => {
      return currentPromise.then((currentResult) => {return [...result, currentResult}]);
  // we return an array that is used as "arrayOfResults"
    });
  }, Promise.resolve([])) // the initial value
  // we use the result array (simply indexes) to render in the browser
  .then((arrayOfResults) => {
    console.log(arrayOfResults);
    arrayOfResults.forEach((result) => {
      console.log(result);
      display("#resu8", result, "Seq :");
    });
  });
```

## AXIOS
