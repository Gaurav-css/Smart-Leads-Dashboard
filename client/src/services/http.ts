import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5000/api";

export const http = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

http.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (axios.isAxiosError(error)) {
      const message =
        (error.response?.data as { message?: string } | undefined)?.message ??
        error.message ??
        "Request failed";
      return Promise.reject(new Error(message));
    }
    return Promise.reject(error);
  },
);

export const setHttpAuthToken = (token: string | null): void => {
  if (token) {
    http.defaults.headers.common.Authorization = `Bearer ${token}`;
    return;
  }

  delete http.defaults.headers.common.Authorization;
};
