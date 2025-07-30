import axios from "axios";
import { BASE_URL } from "../config/api";
import { store } from "../redux/app/store";

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

// ✅ FIXED: Removed repeated console logs and corrected logic
api.interceptors.request.use((config) => {
  const token = getApiHeaders();

  if (token) {
    // only set token if available
    if (!config.headers[headerKeys.AccessToken]) {
      config.headers[headerKeys.AccessToken] = "Bearer " + token;
    }
  }

  // ✅ Always set content-type only if not already set
  if (!config.headers[headerKeys.ContentType]) {
    config.headers[headerKeys.ContentType] = "application/json";
  }

  return config;
});

api.interceptors.response.use(
  function (response) {
    return response.data;
  },
  function (error) {
    console.error("API Error:", error?.response?.data || error.message);
    return Promise.reject(error);
  }
);

function getApiHeaders() {
  const state = store.getState();
  return state?.auth?.token || localStorage.getItem("authToken") || null;
}

// ✅ No changes in request methods, kept as is
export function postRequest(url, body) {
  return new Promise((resolve, reject) => {
    api.post(url, body)
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}

export function postRequestForm(url, body) {
  return new Promise((resolve, reject) => {
    // Don't set Content-Type for FormData - let browser set it with boundary
    api.post(url, body, { headers: {} })
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}

export function patchRequestForm(url, body) {
  return new Promise((resolve, reject) => {
    // Don't set Content-Type for FormData - let browser set it with boundary
    api.patch(url, body, { headers: {} })
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}

export function getRequest(url, params) {
  return new Promise((resolve, reject) => {
    api.get(url, { params })
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}

export function patchRequest(url, body) {
  return new Promise((resolve, reject) => {
    api.patch(url, body)
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}

export function putRequest(url, body) {
  return new Promise((resolve, reject) => {
    api.put(url, body)
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}

export function deleteRequest(url) {
  return new Promise((resolve, reject) => {
    api.delete(url)
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}
