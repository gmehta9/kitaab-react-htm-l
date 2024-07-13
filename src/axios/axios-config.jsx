import axios from "axios";
import Auth from "../auth/Auth";
import toast from "react-hot-toast";

const onRequest = (config) => {
  // console.info(`[request] [${JSON.stringify(config)}]`);
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

  // toast.error(error?.response?.data?.message || 'Something went wrong!')
  toast.error(error?.response?.data?.message || 'Something went wrong!', {
    duration: 2000
  })
  if (error?.response?.status === 401) {

    Auth.logout()

    setTimeout(() => {
      // window.location.href = process.env.REACT_APP_RR || '/#/'
      // window.location.reload();
    }, 1000);

  }

  return Promise.reject(error.response);
}

export function setupInterceptorsTo(axiosInstance) {
  axiosInstance.interceptors.request.use(onRequest, onRequestError);
  axiosInstance.interceptors.response.use(onResponse, onResponseError);
  return axiosInstance;
}

const token = Auth?.token();
export const apiUrl = 'https://tinytyni.com/KbAPI/API_URL/api/'
export const headers = {
  Accept: "application/json",
  "Content-Type": "application/json",
  ...(token &&
    { Authorization: `Bearer ${token}` }
  )
}

export const axiosInstance = setupInterceptorsTo(axios.create({
  baseURL: apiUrl,
  // timeout: 10000,
  // headers: headers
}))

// export const axiosInstance = axios.create({
//   baseURL: process.env.REACT_APP_BASE_URL,
//   timeout: 10000,
// });
