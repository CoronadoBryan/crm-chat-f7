// En tu archivo api.js o donde configures axios
import axios from "axios";

const api = axios.create({
  baseURL: "https://prueba1.yourkate.net/public/api/v1",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ INTERCEPTOR: Agregar token automáticamente a todas las requests
api.interceptors.request.use(
  (config) => {
    // Primero intentar obtener de localStorage (ya que store usa localStorage)
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("Token enviado en header:", token.substring(0, 50) + "..."); // ← Solo mostrar parte del token
    } else {
      console.log("No hay token disponible");
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ✅ INTERCEPTOR: Manejar errores de autenticación
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error("API Error:", error.response?.data || error.message);

    if (error.response?.status === 401) {
      console.log("Token inválido o expirado");

      // Limpiar localStorage
      localStorage.removeItem("token");

      // Redirigir al login usando el store si está disponible
      if (window.app?.f7?.store) {
        window.app.f7.store.dispatch("cerrarSistema");
      } else {
        // Fallback: recargar la página
        window.location.reload();
      }
    }

    return Promise.reject(error);
  }
);

export default api;
