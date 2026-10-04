import axios from "axios";
import Cookies from "js-cookie";

// Create a configured Axios instance
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

// Intercept every request before it goes out
api.interceptors.request.use((config) => {
  // Check if we have an admin token stored in cookies
  const token = Cookies.get("admin_token");
  
  // If we have a token, attach it to the Authorization header
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
}, (error) => {
  return Promise.reject(error);
});