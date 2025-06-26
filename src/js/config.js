import axios from "axios";

const api = axios.create({
  baseURL: "https://prueba1.yourkate.net/public/api/v1",
  headers: {
    "Content-Type": "application/json",
    //Authorization: 'Bearer TU_TOKEN' // si usas JWT
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

// Configuration object for Framework7
const config = {
  mode: process.env.NODE_ENV || "development", // 'development' or 'production'
  endpoint: (uri) => `https://prueba1.yourkate.net/public/api/v1${uri}`,
  // Add other configuration properties as needed
  api: api, // Export the API instance as part of config
};

export default config;
