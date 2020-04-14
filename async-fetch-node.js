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

const uri = "https://jsonplaceholder.typicode.com/posts/";

const getPostByAsync = async (nb) => {
  const response = await fetch(`${uri}${nb}`);
  if (response.ok) {
    const data = await response.json();
    const jsonResponse = new Response(JSON.stringify(data), {
      headers: { "content-type": "application/json" },
    });
    caches.open("result").then((cache) => {
      cache.put("/data.json", jsonResponse);
    });
    return await data.id;
    // try {
    //   const response = await fetch(`${uri}${nb}`);
    //   if (response.ok) {
    //     const data = await response.json();
    //     cache.put(`${uri}1`, response)
    //     return await data.id;
    //   }
    // } catch (err) {
    //   throw new Error(err);
    // })
  }
};

const getPostByPromise = (nb) => {
  return new Promise((resolve, reject) => {
    fetch(`${uri}${nb}`)
      .then(CheckStatus)
      .then((response) => response.json())
      .then((data) => {
        resolve(data.id);
      })
      .catch((err) => reject(err.message));
  });
};

export { getPostByAsync, getPostByPromise };
