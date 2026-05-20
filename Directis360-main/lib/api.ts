import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, // e.g. "http://localhost:5000"
  withCredentials: true, // allow sending and receiving cookies
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      typeof window !== "undefined" &&
      error.response?.data?.error === "Subscription Inactive"
    ) {
      window.location.href = "/no-active-subscription";
    }
    return Promise.reject(error);
  }
);

export default api;
