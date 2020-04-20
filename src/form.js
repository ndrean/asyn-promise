import axios from "axios";
// import FormData from "form-data";

/* Not use JS, replaced by HTML DOM function myForm.reset() in index.js
// const formReset = async (formData) => {
//   const inputs = document.querySelectorAll("input");
//   inputs.forEach((input) => (input.value = ""));
//   for (const key of formData.keys()) {
//     return formData.delete(key);
//   }
// };
*/

const displayInput = async (htmlTag, key, value) => {
  return document
    .querySelector(htmlTag)
    .insertAdjacentHTML("beforeend", `<p>${key}: &nbsp ${value} </p>`);
};

const displayPost = (tag, form) => {
  for (const [k, v] of form.entries()) {
    console.log(k, v);
    displayInput(tag, k, v);
  }
};

const postFetch = async (uri, formData) => {
  try {
    const response = await fetch(uri, { method: "POST", body: formData });
    const result = await response.json();
    return await displayInput("#resu6", "New ID :", result.id).then(() =>
      displayPost("#resu6", formData)
    );
  } catch (err) {
    throw err;
  }
};

const postAxios = async (uri, formData) => {
  try {
    // promise returns a json
    const result = await axios({
      url: uri,
      method: "post",
      data: formData,
    });
    return await displayInput("#resu9", "New ID", result.data.id).then(() => {
      displayPost("#resu9", formData);
    });
  } catch (err) {
    throw err;
  }
};

export { postAxios, postFetch };
