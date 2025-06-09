import axios from "axios";

const api = axios.create({
  baseURL: "https://60cf-38-43-109-54.ngrok-free.app/crm-api/public/api/v1",
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
