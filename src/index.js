import {
  getByAsync,
  getAllPageAxios,
  getAxios,
  uriu,
  display,
} from "./functions.js";

import { postFetch, postAxios } from "./form";

import "./styles.css";

let l = 3; // max number of users in this API

// create an array [1,2,3,...,l]
const arrayOfUsersId = [...Array(l)].map((_, i) => i + 5);

/********* Parallel fetching **************/
const fetchAll = async (arrayOfIds, uri, name) => {
  try {
    // create an array of promises
    const arrayOfPromises = arrayOfIds.map(async (userID) => {
      // Id => return a promise
      const r = await getByAsync(uri, userID, name);
      return display("#resu1", r, "Parallel ");
    });
    // console.log(arrayOfPromises);
    return await Promise.all(arrayOfPromises);
  } catch (err) {
    throw err.message;
  }
};

// fetchAll(arrayOfUsersId, uriu, "All").catch((error) => console.log(error));

/********* Simple loop ************/
// Helper
const f = async (callback, uri, userID, consoleText, cacheName) => {
  try {
    const result = await callback(uri, userID, cacheName);
    return display("#start", result, consoleText);
  } catch (error) {
    console.log("ind", error);
  }
};

// for (let i = 1; i <= l; i++) {
//   f(getByAsync, uriu, i, "Loop", "Loop").catch((err) => console.log(err));
// }

/**************  batch of length p with Promise.then syntax ****************/

const fetchBatch = async (users, name) => {
  const p = 2;
  for (let i = 0; i <= l; i += p) {
    const slicedRequests = users.slice(i, i + p).map(async (userID) => {
      return getByAsync(uriu, userID, name).then((r) =>
        display("#resu2", r, "(Batch # " + i + ")")
      );
      // .catch((err) => console.log("batch", err, userID));
    });
    await Promise.all(slicedRequests); // returns a batch of promises
  }
};

// fetchBatch(arrayOfUsersId, "batch").catch((error) => console.log(error));

/*******************************************/
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
      return currentPromise.then((currentResult) => {
        return [...result, currentResult];
      });
    });
    // initial value is a promise that always resolves, and we pass an empty array as a result
  }, Promise.resolve([]))
  .then((arrayOfResults) => {
    // console.log(arrayOfResults);
    arrayOfResults.forEach((result) => {
      display("#resu8", result, "Sequence ");
    });
  })
  .catch((err) => console.log(err));

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

/************* AXIOS ******************/
//loop
// for (let i = 1; i <= l; i++) {
// getAxios(uriu, i).catch((err) => console.log(err));
// }
//page
// getAllPageAxios(uriu, 1).catch((err) => console.log("Page AXIOS", err));

/*********** POST fetch & Axios ********/
document.querySelector("form").addEventListener("submit", (e) => {
  e.preventDefault();
  const userForm = document.querySelector("form");
  const myForm = new FormData(userForm);
  postFetch(uriu, myForm).then(userForm.reset());
  // .then(
  // postAxios(uriu, myForm).catch((err) => console.log("POST AXIOS", err));
});
