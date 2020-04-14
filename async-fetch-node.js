//  npm i node-fetch --save (to install fetch with node.js)
//const fetch = require("node-fetch"); //no need in browser

// import fetch from "node-fetch";

// helper
function CheckStatus(response) {
  if (response.ok) {
    return response;
  }
  let error = new Error(response.statusText);
  error.response = response;
  return Promise.reject(error);
}

//https://developers.google.com/web/ilt/pwa/caching-files-with-service-worker

const uriu = "https://jsonplaceholder.typicode.com/users/";
const urip = "https://jsonplaceholder.typicode.com/posts/";

const getPostByAsync = async (uri, nb, name) => {
  try {
    const request = new Request(`${uri}${nb}`);
    const response = await fetch(request);
    if (response.ok) {
      caches.open(name).then((cache) => {
        cache.add(request); // cache.put(request, response) if not from web
      });
      caches
        .match(request)
        .then((r) => r.json())
        .then(console.log); // for viewing in the console

      const data = await response.json();
      if (uri === uriu) {
        return await data.username;
      } else if (uri === urip) {
        return await data.title;
      }
    }
  } catch (err) {
    throw new Error(err);
  }
};

const getPostByPromise = (uri, nb) => {
  return new Promise((resolve, reject) => {
    fetch(`${uri}${nb}`)
      .then(CheckStatus)
      .then((response) => response.json())
      .then((data) => {
        resolve(data.email);
      })
      .catch((err) => reject(err.message));
  });
};

export { getPostByAsync, getPostByPromise, urip, uriu };
