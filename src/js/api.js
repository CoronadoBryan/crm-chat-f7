import axios from "axios";

const api = axios.create({
  baseURL: "https://prueba1.yourkate.net/public/api/v1",
  headers: {
    "Content-Type": "application/json",
    // Authorization: 'Bearer TU_TOKEN' // si usas JWT
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

export default api;
