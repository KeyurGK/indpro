import axios from "axios";
import Cookies from "js-cookie";
import { refreshAccessToken } from "./AuthReducer/AuthSlice";
import { API_KEY } from "./ApiKey/api";

const axiosInstance = axios.create({
  baseURL: API_KEY,
  withCredentials: true, // Ensure cookies are sent
});

let isRefreshing = false;
let failedRequestsQueue = [];

// Attach access token before request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = Cookies.get("access"); // Get access token from cookies
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle response errors
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedRequestsQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = `Bearer ${token}`;
            return axiosInstance(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { store } = await import("./store");
        const refreshResponse = await store.dispatch(refreshAccessToken()).unwrap();

        if (refreshResponse.accessToken) {
          const newAccessToken = refreshResponse.accessToken;

          // Update the access token in cookies
          Cookies.set("access", newAccessToken, {
            // path: "/",
            // secure: process.env.NODE_ENV === "production", // Only secure in production
            // sameSite: "Strict",
          });

          // Retry all failed requests with new token
          failedRequestsQueue.forEach((req) => req.resolve(newAccessToken));
          failedRequestsQueue = [];

          // Retry the original request
          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        failedRequestsQueue.forEach((req) => req.reject(refreshError));
        failedRequestsQueue = [];
        
        // If refresh token is invalid, clear everything & logout
        if (refreshError.response?.status === 403) {
          Cookies.remove("access");
          Cookies.remove("refreshToken");
          window.location.href = "/login"; // Redirect user to login page
        }

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
