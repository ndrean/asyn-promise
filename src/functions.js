// const uriu = "https://jsonplaceholder.typicode.com/users/";
// const uriu = "https://jsonplaceholder.typicode.com/posts/";

// const axios = require("axios").default;
import axios from "axios";

const uriu = "https://reqres.in/api/users/";

const display = (htmlID, response, text) => {
  document
    .querySelector(htmlID)
    .insertAdjacentHTML(
      "beforeend",
      `<span>${text}: ${response}  &nbsp | &nbsp</span> `
    );
};

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
    // console.log("cachedObj async/await ", matchedCachedObj.data.email);

    const json = await response.json();
    return await json.data.id;
  } catch (error) {
    throw error;
  }
};
/********************     Promise    **************/
// add origin header on request

// helper
const checkStatus = (response) => {
  if (!response.ok) {
    return Promise.reject(new Error(response));
  }
  return Promise.resolve(response);
};

const getByPromise = async (uri, nb, cacheName) => {
  const request = uri + nb;
  return (
    fetch(request)
      .then((res) => checkStatus(res))
      .then((result) => result.json())
      .then((response) => {
        return response.data.id;
      })
      // saving in cache
      .then(
        caches.open(cacheName).then((cache) => {
          cache.add(request); // cache.put(request, response) if not from web
        })
      )
      // displaying cache in console
      .then(
        caches
          .match(request)
          .then((r) => r.json())
          .then((rjson) => console.log("from cache :", rjson.data.first_name))
      )
      .catch((err) => console.log("BAD PROMISE :", err.message))
  );
};

const getAllPageAxios = async (uri, page) => {
  const pageResponse = await axios.get(uri + "?page=" + page);
  if (pageResponse === undefined) {
    return;
  }
  const result = pageResponse.data.data;
  return result.forEach((response) => {
    display(
      "#resu5",
      JSON.stringify(response.id),
      "(Axios await all page " + page + ")"
    );
  });
};

export { display, getByAsync, getByPromise, uriu, getAllPageAxios };
