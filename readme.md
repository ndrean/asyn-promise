Demo of different `fetch` constructions **client-side** with a public API (endpoint: "https://reqres.in/api/users/" supporting `CORS` and `https`).

We just render the ids in the browser to view the result of testing some fetch chaining strategies:

- [Simple loop](#versions-of-fetch-and-cache-API) with 2 constructions: `async/await` and `promise.then()`

- [Parallel](#parallel-fetching) fetching by using `promise.all()` on an array of promises

- [Sequential](#sequential-fetching) fetching by using `reduce()` on an array of promises

- [Batch](#batch-fetching) fetching with `array.slice()` and then `promise.all()` to fetch by batch

- Short explanation of the implementation of storing fetch GET request into the [cache](#cache)

- Setup and usage of [Workbox](#workbox)

- [Axios](#axios)

- [Bundling Webpack](#bundling)

The data is saved in `cache`.

TODO: `indexedDB`

### Live demo app at:

> <https://fetch-cache.surge.sh>

### Sources:

- <https://web.dev/promises/>

- <https://developers.google.com/web/ilt/pwa/caching-files-with-service-worker>

- <https://golb.hplar.ch/2018/01/A-closer-look-at-the-Cache-API.html>

- <https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Array/reduce>

- <https://decembersoft.com/posts/promises-in-serial-with-array-reduce/>

## Versions of fetch and cache API

Two versions of fetch:

- `new Promise` with `resolve/reject` and `then()` chaining

- `async await` with `try/catch`.

The `cache API` is also implemented with `await` and `then()` versions

## Parallel fetching

Given an array `usersIds = [1,...n]`, we map to an array of promises indexed by `usersIds`. These promises are simply given by `fetch(uri/{id})` and rendered in the browser. We then call `Promise.all([arrayOfPromises])`.

## Sequential fetching

Suppose we have a fixed number of tasks/promises. If we simply do `promise1.then(promise2).then(promise3)`, we can't capture the return values. Then we can do (`display` is just a browser rendering method):

```javascript

Promise.resolve()
  .then((r) => {
    return promise1.then((r) =>  display(...));
})
  .then((r) => {
    return promise2.then((r) =>  display(...));
})
  .then((r) => {
    return promise3.then((r) =>  display(...));
});
```

https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Array/reduce

If we have dynamic promises, we put all the promises in an array and use `reduce()` to collapse the array of promises into a single promise chain.

The `reduce()` method executes a provided callback function `callback` which takes the `previousValue` and `currentValue` which iterates over the array. The function stores the result in the `accumulator` which will be the `previousValue`. It uses and initial value. Here, we take `Promise.resolve([])`, a promise that always resolves to an empty array as the initial value. Then `accumulator === initialValue` on the first time through the callback.

We will capture the result and push it to the array, further used as `arrayOfResults`. It is

then used to display results in the browser with our `display`method.

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

## Batch fetching

We use the same `Promise.all` but this time we slice the array of 'usersId' into smaller arrays; we then map to a promise on each subarrays to produce subarrays of promises. Finaly, we run `promise.all([])`.

> source: https://www.freecodecamp.org/news/promise-all-in-javascript-with-example-6c8c5aea3e32/

## cache

We can use the cache to store `http GET` (only GET). To do so, we just declare a _cache_

by giving it a name and add a stringified key/value `{request: reponse}` (just _request_ in case of an http fetch).

```javascript
const request = new Request(url);
const response = await fetch(request);
// create/open a new named cache
const newCache = await caches.open("cacheName");
// add the {request:response}
await newCache.add(request);
// await cache.put(request, response) if not from web
```

To review it, we can inspect _Application/cache_ in Chrome or display it in the console

with the snippet below:

```javascript
// we look for the request in the cache

const responseFromCache = await caches.match(request);
// then we parse it
const matchedCachedObj = await responseFromCache.json();
// and review in the console:
console.log("cacheName", matchedCachedObj.data.email);
```

## AXIOS

Implementation of alternative library `Axios`: looping, page fetching and post.

## Workbox

TODO

## Bundling

### browserify

If we want to work with `indexedDB`, we can use the `npm` package [idb][1]. To do so, we have a working file _index.js_ that contains the code using `idb`. To use it, we need to require the module `idb`, so we need to bundle it. We can use a quick tool such as the `npm` package [browserify][2]:

> Browserify lets you require('modules') in the browser by bundling up all of your dependencies.

`browserify` will bundle _index.js_ inside a new file _bundle.js_ , that will launched by the browser with a script in _index.html_. We then can use the `idb` module with a _require('idb')_ inside _index.js_.

> yarn add idb browserify</p>

> browserify index.js -o bundle.js

[1]: https://www.npmjs.com/package/idb "idb"
[2]: http://browserify.org/ "browserify"

### Webpack

### Install `npm` packages

We initialize `yarn` (the flag -y will skip all the questions) with `yarn init (-y)` and then install `webpack` with all needed dependencies (`--dev` or `-D`to install locally):

```bash
yarn add webpack webpack-cli webpack-dev-server copy-webpack-plugin html-webpack-plugin css-loader style-loader -D
```

Since we used `Axios`, instead of adding the following cdn script in the _index.html_ file:

> index.html (body)

> script ~~~ src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js" ~~~/script

````

we import the package with `yarn add axios` and add the import where needed in our _.js_ files:

```javascript
+ import axios from "axios";
````

#### Directory setup

Our files system should look like

```bash
|-.cache (if Parcel)
|-node_modules
|-.gitignore
|-readme.md
|-package.json
|-yarn.lock
|-/scr
--|-index.html
--|-index.js
--|-...
|-/dist
```

#### Gitignore

We add `.cache node_modules dist` in the _.gitignore_ file.

```javascript
#package.json
// mainly for Parcel
	"browserslist": [ "since  2017-06" ]
```

### `webpack.config.js`

We will create two configurations for Webpack, development mode and production mode. The Webpack configuration file is presented here as a function so that we can running `webpack --mode production` will assign `config(production)`

```javascript
# webpack.config.js
const  webpack  =  require("webpack");
const  path  =  require("path");
const  HtmlWebpackPlugin  =  require("html-webpack-plugin");

const  config  = (mode) {
  mode,
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"), // our distribution directory will be: `/dist
    filename: "main.js", // the name of the final JS file
  },
  devtool: "inline-source-map", // helper ot locate errors
  plugins: [
  // clean folder between runs
  new  CleanWebpackPlugin(),
  //will automatically inject bundle js into ./dist/index.html
  new  HtmlWebpackPlugin({
    template: "src/index.html",
    filename: "index.html",
  }),
  //copy assets not explicitely referenced from our Javascript
  new  CopyWebpackPlugin([
    { from: "src/img", to: "img/" }
    ]),
  ],
  module: { // to compile the CSS files
    rules: [{ test: /\.css$/, use: ["style-loader", "css-loader"] }],
  },
};
module.exports  =  config();
```

#### Note on CSS

We added the packages `css-loader` and `style-loader` packages firstly (declared in `package.json`).

We have defined how to import CSS files in _webpack.config.js_, namely how to find them and them compile and inject the styles:

> `module: {rules: [{ test: /\.css$/, use: ["style-loader", "css-loader"] }]}`

We also have to add `import "./styles.css"` within _index.js_ and remove the link in the header of the _index.html_ file.

```javascript
#index.js
+ import "./styles.css"
```

~~~script link rel="stylesheet" type="text/css" href="./styles.css" script~~~

#### npm scripts in `package.json`

Webpack is configured within the file `webpack.config.js`. With the CLI, we can run commands like `yarn webpack --mode development --config webpack.config.js` to compile in development mode for example. Webpack will use the default configuration file `webpack.config.js` of webpack if present.

> the `webpack.config.js` file is picked by default if present, so we can not mention it

Instead of running commands for `webpack-cli` in the terminal, we can add helpers by adding `npm scripts` to the `package.json` file.

```javascript
# package.json
{
"scripts":{
	"clean": "rm dist/*",
	"dev": " webpack --mode development --hot --config webpack.config.js",
	"build": "webpack -p --mode production",
	"serve": "webpack-dev-server"
	}
}
```

We can now run in a terminal:

```bash
yarn clean (this empties the '/dist' folder)
yarn dev (bundles in development mode)
yarn build (bundles in production mode when ready to minimize and output in the '/dist' folder)
yarn serve (runs a development server)
```

#### Change Link to .js

Since we will compile the project to the _main.js_ file in the _/dist_ folder, we make the script in the _index.html_ point to the output filename (`output: [...,filename: "main.js"])`) used in _webpack.config.js_

> # index.html

script type="module" ~~~scr="index.js"~~~ => src="main.js"> /script

### Compile and launch `web-pack-dev-server`

To compile the project, we run in the terminal the _npm_ scripts helpers that we defined: `yarn dev` or `yarn build` once it's finished.

Once the compilation is made, with this config, we will serve the files with `webpack-dev-server` so that the `--watch` mode is automatically on, meaning that it will recompile automatically whenever files change (HTML or CSS or Javascript) so that we don't have to reload the page or stop/start the web server.

### Notes for `Parcel.js`

- Firstly, we need a file `index.html` and create a directory `/src` and put all our files inside. The main js file will be named `/src/index.js`. The link to this file should be declared in the _index.html_ file **without type="module"** (which is needed for `webpack`otherwise).

it is ~~~ok~~~~

script ~~~type="module"~~~ src="src/index.js"> /script

- Then since we use `async/await`, we can limit the accepted of browsers to those who accept ES5, through the file `package.json` ( if we use the bundler `Parcel`)

```javascript
#package.json
	"browserslist": [ "since  2017-06" ]
```

## Error handling

<https://stackoverflow.com/questions/45285129/any-difference-between-await-promise-all-and-multiple-await/54291660#54291660>
