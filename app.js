import { getPostByAsync, getPostByPromise } from ".///async-fetch-node.js";
//import { parallel } from "./async-fetch-node";

const display = (htmlID, userID, text) => {
  document
    .querySelector(htmlID)
    .insertAdjacentHTML("beforeend", `<p>${text}: ${userID}</p>`);
};

const line = () =>
  document.querySelector("#app").insertAdjacentHTML("beforeend", "<hr>");

const f = async (callback, userID, text) => {
  return await callback(userID)
    .then((r) => display("#app", r, text))
    .catch(console.error);
};

let l;

const fetchAll = async (listIdUsers) => {
  const promises = listIdUsers.map((userID) => {
    return getPostByAsync(userID).then(display("#resu1", userID, "parallel"));
  });
  return Promise.all(promises).then();
};

l = 10;
let users = [...new Array(l)].map((x, i) => i + 1);
fetchAll(users).then();

// traitement individuel
// f(getPostByPromise, 2, "Promise");
// f(getPostByAsync, 3, "Async");
for (let i = 1; i < 10; i++) {
  f(getPostByAsync, i, "Async");
}

// Test en parallèle

// Test par batch de p=5;
l = 10;
users = [...new Array(l)].map((x, i) => i + 1);

const fetchBatch = async (users) => {
  const p = 5;
  for (let i = 0; i <= l; i += p) {
    const requests = users.slice(i, i + p).map(async (userID) => {
      return getPostByPromise(userID)
        .then(display("#resu2", userID, "batch"))
        .catch((err) => console.log(err, userID));
    });
    await Promise.all(requests); // returns a batch of promises
  }
};
fetchBatch(users).then();
// https://www.freecodecamp.org/news/promise-all-in-javascript-with-example-6c8c5aea3e32/
