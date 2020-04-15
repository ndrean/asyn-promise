//  npm i node-fetch --save (to install fetch with node.js)
//const fetch = require("node-fetch"); //no need in browser

// import fetch from "node-fetch";

//https://developers.google.com/web/ilt/pwa/caching-files-with-service-worker

// const uriu = "https://jsonplaceholder.typicode.com/users/";
// const urip = "https://jsonplaceholder.typicode.com/posts/";

const uriu = "https://reqres.in/api/users/";

const getByAsync = async (uri, nb, name) => {
  try {
    const request = new Request(`${uri}${nb}`);
    const response = await fetch(request);
    if (!response.ok) {
      throw new Error(response.statusText);
    }

    caches.open(name).then((cache) => {
      cache.add(request); // cache.put(request, response) if not from web
    });
    caches
      .match(request)
      .then((r) => r.json())
      .then((json) => console.log(json.data.email)); // for viewing in the console

    const result = await response.json();
    return await result.data.email;
  } catch (error) {
    console.log(error);
  }
};
/********************     Promise    **************/
// helper
function CheckStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return Promise.resolve(response);
  } else {
    return Promise.reject(new Error(response.statusText));
  }
}
const getByPromise = (uri, nb) => {
  return new Promise((resolve, reject) => {
    fetch(uri + nb) // `${uri}${nb}`
      // .then(function (result) {
      //   CheckStatus(result);
      // })
      .then((res) => res.json())
      .then((result) => {
        resolve(result.data.email);
      })
      .catch((err) => reject(err.message));
  });
};

async function getByAxios(uri, nb) {
  try {
    const request = new Request(uri + nb);
    console.log("obj req ", request);
    const response = await axios.get(uri + nb);

    if (!response.status === 200) {
      throw Error(response.statusText);
    }
    console.log("axios: ", response.data.data.email);
    console.log(JSON.stringify(response.data.data));
  } catch (error) {
    console.log(error.message);
  }
}

const postByAxios = async (uri, name, job) => {
  const response = await axios.post(uri, { name, job }); // {name: name, job: job} identique

  console.log("rep :", response);
};

export { getByAsync, getByPromise, getByAxios, postByAxios, uriu };
