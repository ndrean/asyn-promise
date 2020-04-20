const uriu = "https://jsonplaceholder.typicode.com/users/";
// const uriu = "https://jsonplaceholder.typicode.com/posts/";

// const axios = require("axios").default;
import axios from "axios";

// const uriu = "https://reqes.in/api/users/";

const display = (htmlID, response, text) => {
  document
    .querySelector(htmlID)
    .insertAdjacentHTML(
      "beforeend",
      `<span>${text}: ${response}  &nbsp , &nbsp</span> `
    );
};

const getByAsync = async (uri, nb, cacheName) => {
  try {
    const request = new Request(`${uri}${nb}`);
    const response = await fetch(request);
    const check = await checkStatus(response);
    if (!check.ok) {
      console.log(check.ok);
      throw check.statusText;
    }
    // add to cache
    const newCache = await caches.open(cacheName);
    await newCache.add(request); // if 200
    // <=> cache.put(request, response=await fetch(request)) for anything (include not from web)

    //display in console from cache
    const responseFromCache = await caches.match(request);
    const matchedCachedObj = await responseFromCache.json();
    // console.log("from cache await ", matchedCachedObj.data.email);

    const json = await check.json();
    return await json.id; //json.data.id;
  } catch (error) {
    throw error;
  }
};
/********************     Promise    **************/
// add origin header on request

// helper
const checkStatus = async (response) => {
  if (!response.ok) {
    return await Promise.reject(new Error(response));
  }
  return await Promise.resolve(response);
};

const getAxios = async (uri, i) => {
  try {
    const response = await axios.get(uri + i);
    // no need parse json
    return display("#resu4", response.data.id, "Axios ");
  } catch (error) {
    throw error;
  }
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

export { display, getByAsync, uriu, getAxios, getAllPageAxios };
