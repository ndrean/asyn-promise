import {
  getByAsync,
  getByPromise,
  getAllPageAxios,
  uriu,
  display,
} from ".///functions.js";

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
        (r) => display("#resu1", r, "Parallel ") //.catch((error) => console.log(error))
      );
    });
    // console.log(arrayOfPromises);
    return Promise.all(arrayOfPromises).catch((error) => console.log(error));
  } catch (err) {
    throw err.message;
  }
};

fetchAll(arrayOfUsersId, uriu, "All").catch((error) => console.log(error));

/********* Simple loop ************/
// Helper
const f = async (callback, uri, userID, consoleText, cacheName) => {
  return await callback(uri, userID, cacheName)
    .then((r) => display("#start", r, consoleText))
    .catch((error) => console.log("ind", error));
};

const line = async () => {
  document.querySelector("#start").insertAdjacentHTML("beforeend", "<hr/>");
};

for (let i = 1; i <= l; i++) {
  f(getByAsync, uriu, i, "Loop Await", "Ind_Async")
    .then(f(getByPromise, uriu, i, "Loop Promise", "Ind_Promise"))
    .catch((error) => console.log(error));
}

/**************  batch of length p with Promise.then syntax ****************/

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
      return currentPromise.then((currentResult) => [...result, currentResult]);
    });
    // initial value is a promise that always resolves, and we pass an empty array as a result
  }, Promise.resolve([]))
  .then((arrayOfResults) => {
    console.log(arrayOfResults);
    arrayOfResults.forEach((result) => {
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

/************* AXIOS ******************/
for (let i = 1; i <= l; i++) {
  try {
    axios
      .get(uriu + i)
      .then((r) => display("#resu4", r.data.data.id, "Axios "));
  } catch (err) {
    console.log("AXIOS", err);
  }
}

getAllPageAxios(uriu, 1).catch((err) => console.log("Page AXIOS", err));

axios
  .post(uriu, { name: "jo", job: "dev" })
  .then((r) => {
    display("#resu6", r.data.id, "Post Axios");
    console.log("post", r.data);
  })
  .catch((err) => console.log("POST", err));
