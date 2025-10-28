import axios from "axios";
import toast from "react-hot-toast";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
  timeout: 10000, // 10 second timeout
});

// Request interceptor - Add auth token to all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
api.interceptors.response.use(
  (response) => {
    // Return successful response
    return response;
  },
  (error) => {
    // Handle different types of errors
    if (error.response) {
      // Server responded with error status
      const status = error.response.status;
      const message = error.response.data?.message || "An error occurred";

      switch (status) {
        case 400:
          // Bad Request
          console.error("Bad Request:", message);
          break;
        
        case 401:
          // Unauthorized - clear token and redirect to login
          console.error("Unauthorized:", message);
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          window.location.href = "/login";
          toast.error("Session expired. Please login again.");
          break;
        
        case 403:
          // Forbidden
          console.error("Forbidden:", message);
          toast.error("You don't have permission to perform this action");
          break;
        
        case 404:
          // Not Found
          console.error("Not Found:", message);
          break;
        
        case 500:
          // Server Error
          console.error("Server Error:", message);
          toast.error("Server error. Please try again later.");
          break;
        
        default:
          console.error("Error:", message);
      }
    } else if (error.request) {
      // Request made but no response received
      console.error("Network Error:", error.request);
      toast.error("Network error. Please check your connection.");
    } else {
      // Something else happened
      console.error("Error:", error.message);
      toast.error("An unexpected error occurred");
    }

    return Promise.reject(error);
  }
);

export default api;