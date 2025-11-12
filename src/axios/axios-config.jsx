import axios from "axios";
import Auth from "../auth/Auth";
import toast from "react-hot-toast";

const onRequest = (config) => {
  // console.info(`[request] [${JSON.stringify(config)}]`);
  const token = Auth.token();
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  config.headers['Accept'] = `application/json`;
  config.headers['Content-Type'] = `application/json`;
  return config;
}

const onRequestError = (error) => {
  console.error(`[request error] [${error}]`);
  return Promise.reject(error);
}

const onResponse = (response) => {
  // console.info(`[response] [${JSON.stringify(response)}]`);
  return response.data;
}

const onResponseError = (error) => {
  console.log(error);
  const data = error?.response?.data || {};

  // If validation errors exist, show only those messages (no field names).
  if (data.errors && typeof data.errors === 'object') {
    const details = Object.values(data.errors)
      .flatMap(v => Array.isArray(v) ? v : [v])
      .join('\n'); // each message on its own line

    const toastId = `api-err-${error?.response?.status || 'unknown'}-${Date.now()}`;

    toast.error(details || 'Something went wrong!', {
      duration: 3500,
      id: toastId,
      style: { whiteSpace: 'pre-wrap' }, // preserve newlines
      // close this specific toast when clicked
      onClick: () => toast.dismiss(toastId),
    });
  } else {
    const message = data.message || 'Something went wrong!';
    const toastId = `api-err-${error?.response?.status || 'unknown'}-${Date.now()}`;

    toast.error(message, {
      duration: 3500,
      id: toastId,
      style: { whiteSpace: 'pre-wrap' },
      onClick: () => toast.dismiss(toastId),
    });
  }

  if (error?.response?.status === 401) {

    Auth.logout()

    setTimeout(() => {
      window.location.href = 'https://kitaabjunction.com/'
    }, 300);

  }

  return Promise.reject(error.response);
}

export function setupInterceptorsTo(axiosInstance) {
  axiosInstance.interceptors.request.use(onRequest, onRequestError);
  axiosInstance.interceptors.response.use(onResponse, onResponseError);
  return axiosInstance;
}

export const apiUrl = process.env.REACT_APP_BASE_URL
export const headers = {
  Accept: "application/json",
  "Content-Type": "application/json",
}

export const axiosInstance = setupInterceptorsTo(axios.create({
  baseURL: apiUrl,
  // timeout: 10000,
}))

// export const axiosInstance = axios.create({
//   baseURL: process.env.REACT_APP_BASE_URL,
//   timeout: 10000,
// });
