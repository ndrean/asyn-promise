// const uriu = "https://jsonplaceholder.typicode.com/posts/";
// const uriu = "https://jsonplaceholder.typicode.com/posts/";

// const axios = require("axios").default;
import axios from "axios";

const uriu = "https://reqres.in/api/users/";

//helper
const display = (htmlID, response, text) => {
  document
    .querySelector(htmlID)
    .insertAdjacentHTML(
      "beforeend",
      `<span>${text}: ${response}  &nbsp , &nbsp</span> `
    );
};

// helper
// const checkStatus = async (response) => {
//   if (!response.ok) {
//     return await Promise.reject(new Error(response));
//   }
//   return await Promise.resolve(response);
//   // return new Promise((resolve) => resolve(response)); // identical
// };

// version promise(resolve,reject)
const checkStatus = (response) => {
  return new Promise((resolve, reject) => {
    resolve(response), reject(new Error(response));
  });
};

const getByAsync = async (uri, nb, cacheName) => {
  try {
    const request = new Request(`${uri}${nb}`);
    const response = await fetch(request);

    const check = await checkStatus(response);
    if (!check.ok) {
      console.log(check);
      throw check.statusText;
    }
    //add to cache
    const newCache = await caches.open(cacheName);
    await newCache.add(request); // if 200
    //<=> cache.put(request, response=await fetch(request)) for anything (include not from web)

    //display in console from cache
    const responseFromCache = await caches.match(request);
    const matchedCachedObj = await responseFromCache.json();
    console.log("from cache :", matchedCachedObj.name);

    const json = await check.json();
    return await json.data.id; //json.id;
  } catch (error) {
    throw error;
  }
};
/********************     Promise    **************/
// add origin header on request

const getAxios = async (uri, i) => {
  try {
    const response = await axios.get(uri + i);
    // no need parse json
    console.log(response);
    return display("#resu4", response.data.data.id, "Axios "); // reponse.data.id typicode
  } catch (error) {
    throw error;
  }
};

export { display, getByAsync, uriu, getAxios };
