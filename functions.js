//  npm i node-fetch --save (to install fetch with node.js)
//const fetch = require("node-fetch"); //no need in browser

// import fetch from "node-fetch";

//https://developers.google.com/web/ilt/pwa/caching-files-with-service-worker

// const uriu = "https://jsonplaceholder.typicode.com/users/";
// const urip = "https://jsonplaceholder.typicode.com/posts/";

const uriu = "https://reqres.in/api/users/";

const getByAsync = async (uri, nb, cacheName) => {
  try {
    const request = new Request(`${uri}${nb}`);
    const response = await fetch(request);
    if (!response.ok) {
      throw response.statusText;
    }
    // add to cache
    const newCache = await caches.open(cacheName);
    await newCache.add(request); // if 200
    // <=> cache.put(request, response = await fetch(request)) for anything (include not from web)

    //display in console from cache
    const responseFromCache = await caches.match(request);
    const matchedCachedObj = await responseFromCache.json();
    console.log("cachedObj async/await ", matchedCachedObj.data.email);

    const result = await response.json();

    return await result.data.id;
  } catch (error) {
    console.log(error.statusText);
  }
};
/********************     Promise    **************/
// add origin header on request

const getByPromise = async (uri, nb, cacheName) => {
  const request = uri + nb;
  const promise = new Promise((resolve, reject) => {
    fetch(request)
      .then((response) => {
        if (!response.ok) reject(error.statusText);
        resolve(response);
      })
      .catch((error) => console.log(error));
  });
  return promise
    .then((response) => response.json())
    .then((result) => {
      return result.data.id;
    })
    .then(
      // saving in cache
      caches.open(cacheName).then((cache) => {
        cache.add(request); // cache.put(request, response) if not from web
      })
    )
    .then(
      // displaying cache in console
      caches
        .match(request)
        .catch((err) => {
          throw err.statusText;
        })
        .then((r) => r.json())
        .then((json) => console.log("from cache :", json.data.email))
        .catch((err) => console.log(err.message))
    )
    .catch((err) => {
      throw err.statusText;
      // console.log(err);
      // reject(err.message);
    });
};

async function getByAxios(uri, nb) {
  try {
    const response = await axios.get(uri + nb);

    if (!response.status === 200) {
      // console.log(response.statusText);
      throw Error(response.statusText);
    }
    return await response.data.data;
    console.log("axios: ", response.data.data.email);
    console.log(JSON.stringify(response.data.data));
  } catch (error) {
    console.log(error.message);
  }
}

const postByAxios = async (uri, name, job) => {
  try {
    const response = await axios.post(uri, { name, job }); // {name: name, job: job} identique
  } catch (e) {
    console.log(e.message);
    // throw e;
  }
};

const getAllPageAxios = async (uri, page) => {
  try {
    const pageResponse = await axios.get(uri + "?page=" + page);
    const arrayResponse = pageResponse.data.data;
    arrayResponse.forEach((response) => {
      display(
        "#resu5",
        JSON.stringify(response.id),
        "Axios await all page " + page
      );
    });
  } catch (err) {
    throw new Error(err.message);
  }
};

const display = (htmlID, response, text) => {
  document
    .querySelector(htmlID)
    .insertAdjacentHTML(
      "beforeend",
      `<span>${text}: ${response}  &nbsp | &nbsp</span> `
    );
};

export {
  display,
  getByAsync,
  getByPromise,
  getByAxios,
  postByAxios,
  getAllPageAxios,
  uriu,
};
