import {
  getByAsync,
  getByPromise,
  getByAxios,
  postByAxios,
  getAllPageAxios,
  uriu,
  display,
} from ".///functions.js";

// const axios = require("axios");
//import { parallel } from "./async-fetch-node";

let l = 12; // max number of users in this API

// create an array [1,2,3,...,l]
const arrayOfUsersId = [...Array(l)].map((_, i) => i + 1);

/********* Parallel fetching **************/
const fetchAll = async (arrayOfIds, uri, name) => {
  try {
    // create an array of promises
    const arrayOfPromises = arrayOfIds.map((userID) => {
      // Id => return a promise
      return getByAsync(uri, userID, name).then(
        (r) => display("#resu1", r, "Parallel :") //.catch((error) => console.log(error))
      );
    });
    return Promise.all(arrayOfPromises).catch((error) => console.log(error));
  } catch (err) {
    // console.log(err.message);
    throw new Error(err.message);
  }
};

fetchAll(arrayOfUsersId, uriu, "All").catch((error) => console.log(error));

// Helper
const f = async (callback, uri, userID, consoleText, cacheName) => {
  return await callback(uri, userID, cacheName)
    .then((r) => display("#start", r, consoleText))
    .catch((error) => console.log("ind", error));
};
const line = async () => {
  document.querySelector("#start").insertAdjacentHTML("beforeend", "<hr/>");
};
/********* Simple loop ************/
for (let i = 1; i <= l; i++) {
  f(getByAsync, uriu, i, "Loop on index", "Ind_Async")
    .then(f(getByPromise, uriu, i, "Loop Promise", "Ind_Promise"))
    .then(line)
    .catch((error) => console.log(error));
}

/* Simple loop squential */

// for (let i = 1; i <= l; i++) {
//   f(getByAsync, uriu, i, "Loop on index", "Ind_Async");
// }

/**************  batch of length p with Promise.then syntax ****************/
// https://www.freecodecamp.org/news/promise-all-in-javascript-with-example-6c8c5aea3e32/

const fetchBatch = async (users, name) => {
  const p = 4;
  for (let i = 0; i <= l; i += p) {
    const slicedRequests = users.slice(i, i + p).map(async (userID) => {
      return getByPromise(uriu, userID, name)
        .then((r) => display("#resu2", r, "Batch :" + i))
        .catch((err) => console.log("batch", err, userID));
    });
    await Promise.all(slicedRequests); // returns a batch of promises
  }
};
fetchBatch(arrayOfUsersId, "batch :").catch((error) => console.log(error));
// https://www.freecodecamp.org/news/promise-all-in-javascript-with-example-6c8c5aea3e32/

/* Sequential with Reduce */
// const tasks = getTaskArray() => {
//   return tasks
//   .reduce((promiseChain, currentTask) => {
//     return promiseChain.then((chainResults) =>
//       currentTask.then((currentResult) => [...chainResults, currentResult])
//     );
//   }, Promise.resolve([]))
//   .then((arrayOfResults) => {
//     // Do something with all results
//   });
// }

/* AXIOS */
for (let i = 1; i <= l; i++) {
  axios
    .get(uriu + i)
    .then((r) => display("#resu4", r.data.data.id, "Axios "))
    .catch((error) => console.log(error));
}

getByAxios(uriu, 1)
  .then((r) => display("#resu7", r.id, "Axios "))
  .catch((error) => console.log(error));

getAllPageAxios(uriu, 1).catch((error) => console.log(error));

axios.post(uriu, { name: "jo", job: "dev" }).then((r) => {
  display("#resu6", r.data.id, "Post Axios");
  console.log("post", r.data);
});
