import {
  getByAsync,
  getByPromise,
  postByAxios,
  getAllPageAxios,
  uriu,
  display,
} from ".///functions.js";

//import { parallel } from "./async-fetch-node";

let l = 12; // max number of users in this API

// create an array [1,2,3,...,l]
const arrayOfUsersId = [...Array(l)].map((_, i) => i + 1);

/********* Parallel fetching **************/
// helper

const fetchAll = async (arrayOfIds, uri, name) => {
  try {
    // create an array of promises
    const arrayOfPromises = arrayOfIds.map((userID) => {
      // Id => return a promise
      return getByAsync(uri, userID, name).then(
        (r) => display("#resu1", r, "Parallel :") //.catch((error) => console.log(error))
      );
    });
    console.log(arrayOfPromises);
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
  f(getByAsync, uriu, i, "Loop Await", "Ind_Async")
    .then(f(getByPromise, uriu, i, "Loop Promise", "Ind_Promise"))
    .catch((error) => console.log(error));
}

/**************  batch of length p with Promise.then syntax ****************/
// https://www.freecodecamp.org/news/promise-all-in-javascript-with-example-6c8c5aea3e32/

const fetchBatch = async (users, name) => {
  const p = 4;

  for (let i = 0; i <= l; i += p) {
    const slicedRequests = users.slice(i, i + p).map(async (userID) => {
      return getByPromise(uriu, userID, name).then((r) =>
        display("#resu2", r, "(Batch: # " + i + ")")
      );
      // .catch((err) => console.log("batch", err, userID));
    });
    await Promise.all(slicedRequests); // returns a batch of promises
  }
};
fetchBatch(arrayOfUsersId, "batch").catch((error) => console.log(error));

// https://www.freecodecamp.org/news/promise-all-in-javascript-with-example-6c8c5aea3e32/

/* Sequential with Reduce */

// create an array of promises
const arrayOfSortedPromises = () => {
  let array = [];
  arrayOfUsersId.forEach((i) => {
    // array = [...array, getByPromise(uriu, i, "Seq")];
    array.push(getByAsync(uriu, i, "Sequential"));
  });
  return array;
};
const promises = arrayOfSortedPromises();

promises
  .reduce((promiseChain, currentPromise) => {
    return promiseChain.then((result) => {
      return currentPromise.then((currentResult) => [...result, currentResult]);
    });
  }, Promise.resolve([]))
  .then((arrayOfResults) => {
    console.log(arrayOfResults);
    arrayOfResults.forEach((result) => {
      console.log(result);
      display("#resu8", result, "Sequence ");
    });
  });

// Promise.resolve([])
//   .then((r) => {
//     return arrayOfSortedPromises()[0].then((r) => {
//       display("#resu8", r, "Seq :" + 1);
//     });
//     return [...[], r];
//   })
//   .then((r) => {
//     return arrayOfSortedPromises()[1].then((r) =>
//       display("#resu8", r, "Seq :" + 2)
//     );
//   })
//   .then((r) => {
//     return arrayOfSortedPromises()[2].then((r) =>
//       display("#resu8", r, "Seq :" + 3)
//     );
//   });

/* AXIOS */
for (let i = 1; i <= l; i++) {
  try {
    axios
      .get(uriu + i)
      .then((r) => display("#resu4", r.data.data.id, "Axios "));
  } catch (err) {
    console.log("AXIOS", err);
  }
}

axios(uriu + 1)
  .then((r) => display("#resu7", r.data.data.id, "Axios "))
  .catch((err) => console.log("AXIOS", err));

getAllPageAxios(uriu, 1).catch((err) => console.log("Page AXIOS", err));

axios
  .post(uriu, { name: "jo", job: "dev" })
  .then((r) => {
    display("#resu6", r.data.id, "Post Axios");
    console.log("post", r.data);
  })
  .catch((err) => console.log("POST", err));
