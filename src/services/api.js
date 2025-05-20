import axios from "axios";
import { BASE_URL } from "../config/api";
import { store } from "../redux/app/store";
// import { BASE_URL } from "../../config/api";
export const headerKeys = {
  AccessToken: "Authorization",
  Expiry: "expiry",
  TokenType: "token-type",
  Uid: "uid",
  Client: "client",
  ContentType: "Content-Type",
};

const api = axios.create({
  baseURL: BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = getApiHeaders();
  //   console.
  if (config.headers && token) {
    console.log("Application/json");
    config.headers[headerKeys.AccessToken] = "Bearer " + token;
  } else if (!token) {
    console.log("Multipart form data");
    config.headers[headerKeys.ContentType] = "Application/json";
  }
  return config;
});

api.interceptors.response.use(
  function (response) {
    return response.data;
  },
  function (error) {
    console.log("error", error);

    if (error.response) {
      console.log("error", error.response);
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
    } else {
      // Something happened in setting up the request that triggered an Error
    }
    // return Promise.reject(error);
    return Promise.reject(error);
  }
);

function getApiHeaders() {
  const state = store.getState(); // Access the state
  const token = state.auth.token;
  console.log("token", token);
  //   console.log("store.getState()", store.getState().userDataReducer);
  // return localStorage.getItem("token");
  return token;
}

export function postRequest(url, body) {
  return new Promise((resolve, reject) => {
    try {
      api
        .post(url, body)
        .then((response) => {
          console.log("response", response);
          resolve(response);
        })
        .catch((error) => {
          console.log("error", error);
          reject(error);
        });
    } catch {}
  });
}

export function postRequestForm(url, body) {
  return new Promise((resolve, reject) => {
    try {
      api
        .post(url, body, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          console.log("response", response);
          resolve(response);
        })
        .catch((error) => {
          console.log("error", error);
          reject(error);
        });
    } catch (error) {
      console.error("Error in postRequest:", error);
      reject(error);
    }
  });
}

export function patchRequestForm(url, body) {
  return new Promise((resolve, reject) => {
    try {
      api
        .patch(url, body, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          console.log("response", response);
          resolve(response);
        })
        .catch((error) => {
          console.log("error", error);
          reject(error);
        });
    } catch (error) {
      console.error("Error in patchRequest:", error);
      reject(error);
    }
  });
}

export function getRequest(url, params) {
  return new Promise((resolve, reject) => {
    api
      .get(url, { params: params })
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        console.log("error from api.js ", error);
        reject(error);
      });
  });
}

export function patchRequest(url, body) {
  return new Promise((resolve, reject) => {
    api
      .patch(url, body)
      .then((response) => {
        console.log("response", response);
        resolve(response);
      })
      .catch((error) => {
        console.log("error", error);
        reject(error);
      });
  });
}
export function deleteRequest(url) {
  return new Promise((resolve, reject) => {
    api
      .delete(url)
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
}
