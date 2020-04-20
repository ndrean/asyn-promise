import axios from "axios";
import { display } from "./functions";
// import FormData from "form-data";

const formReset = async (formData) => {
  const inputs = document.querySelectorAll("input");
  inputs.forEach((input) => (input.value = ""));
  for (const key of formData.keys()) {
    return formData.delete(key);
  }
};

const displayInput = async (htmlTag, key, value) => {
  return document
    .querySelector(htmlTag)
    .insertAdjacentHTML("beforeend", `<p>${key}: &nbsp ${value} </p> <br> `);
};

const displayPost = async (tag, form) => {
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
      displayPost("#resu6", formData).then(formReset(formData))
    );
  } catch (err) {
    throw err;
  }
};

const postAxios = async (uri, formData) => {
  try {
    const response = await axios.post({
      url: uri,
      method: "post",
      data: formData,
    });
    const result = await response.json();
    return await display("#resu9", result.data.id, "Post Axios")
      .then(() => display("#resu9", formData))
      .then(formReset(formData));
  } catch (err) {
    throw err;
  }
};

export { postAxios, postFetch };
