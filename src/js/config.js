import axios from "axios";

const api = axios.create({
  baseURL: "https://prueba1.yourkate.net/public/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para manejar errores globalmente
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

const config = {
  mode: process.env.NODE_ENV || "development",
  endpoint: function (path) {
    if (this.mode === "development") {
      return "https://prueba1.yourkate.net/public/api/v1" + path;
    }

    return "https://prueba1.yourkate.net/public/api/v1" + path;
  },
  backend_public: "https://prueba1.yourkate.net/public/",
  api: api,
};

export default config;
