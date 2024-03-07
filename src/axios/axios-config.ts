import axios, { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import toast from 'react-hot-toast';
import Auth from "../Auth/Auth";

const onRequest = (config): InternalAxiosRequestConfig => {
  // consoleLogs(`[request] [${JSON.stringify(config)}]`);
  return config;
}

const onRequestError = (error: AxiosError): Promise<AxiosError> => {
  // consoleLogs(`[request error] [${JSON.stringify(error)}]`);
  return Promise.reject(error);
}

const onResponse = (response: AxiosResponse): AxiosResponse => {
  // consoleLogs(`[response] [${JSON.stringify(response)}]`);
  return response.data;
}

const onResponseError = (error: AxiosError<any>): Promise<AxiosError> => {
  // consoleLogs(`[response error] [${JSON.stringify(error?.response?.data?.message)}]`);

  if (error?.response?.data?.errors && Object.keys(error?.response?.data?.errors).length > 0) {
    for (let key in error?.response?.data?.errors) {
      toast.error(error?.response?.data?.errors[key][0])
    }
  } else {
    toast.error(error?.response?.data?.message || 'Something went wrong!')
  }

  if (error?.response?.status === 401) {

    Auth.logout()

    setTimeout(() => {
      window.location.href = process.env.REACT_APP_RR || '/#/'
      // window.location.reload();
    }, 1000);

  }

  return Promise.reject(error.response);
}

export function setupInterceptorsTo(axiosInstance: AxiosInstance): AxiosInstance {
  axiosInstance.interceptors.request.use(onRequest, onRequestError);
  axiosInstance.interceptors.response.use(onResponse, onResponseError);
  return axiosInstance;
}

const token = Auth?.token();

export const headers = {
  Accept: "application/json",
  "Content-Type": "application/json",
  ...(token &&
    { Authorization: `Bearer ${token}` }
  )
}

export const axiosInstance = setupInterceptorsTo(axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
  timeout: 10000,
}))

// export const axiosInstance = axios.create({
//   baseURL: process.env.REACT_APP_BASE_URL,
//   timeout: 10000,
// });
