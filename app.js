import {
  getByAsync,
  getByPromise,
  getByAxios,
  postByAxios,
  uriu,
} from ".///async-fetch-node.js";

// const axios = require("axios");
//import { parallel } from "./async-fetch-node";

const display = (htmlID, response, text) => {
  document
    .querySelector(htmlID)
    .insertAdjacentHTML("beforeend", `<p>${text}: ${response}</p>`);
};

/********* Test en parallèle **************/
const fetchAll = async (listIdUsers, uri, name) => {
  const promises = listIdUsers.map((userID) => {
    return getByAsync(uri, userID, name).then((r) =>
      display("#resu1", r, "parallel")
    ); // returns a Promise
  });
  return Promise.all(promises).then();
};

let l;
l = 10;
let users = [...new Array(l)].map((x, i) => i + 1);
fetchAll(users, uriu, "All").then();

/********* traitement individuel ************/
const f = async (callback, uri, userID, text, name) => {
  return await callback(uri, userID, name)
    .then((r) => display("#app", r, text))
    .catch((error) => console.log("ind", error));
};
// f(getByPromise, 2, "Promise");
// f(getByAsync, 3, "Async");
for (let i = 1; i < l; i++) {
  f(getByAsync, uriu, i, "Async", "Individual");
}

/**************  par batch de p=3 avec Promise ****************/
l = 10;
users = [...new Array(l)].map((x, i) => i + 1);

const fetchBatch = async (users, name) => {
  const p = 3;
  for (let i = 0; i <= l; i += p) {
    const requests = users.slice(i, i + p).map(async (userID) => {
      return getByPromise(uriu, userID, name)
        .then((r) => display("#resu2", r, "batch"))
        .catch((err) => console.log("batch", err, userID));
    });
    await Promise.all(requests); // returns a batch of promises
  }
};
fetchBatch(users, "batch").then();
// https://www.freecodecamp.org/news/promise-all-in-javascript-with-example-6c8c5aea3e32/

getByAxios(uriu, 1);
postByAxios(uriu, "jo", "dev");

const getAllPageAxios = async (uri, page) => {
  const rep = await axios.get(uri + "?page=" + page);
  console.log("All page :", page, " are :", rep.data.data);
};
getAllPageAxios(uriu, 1);
