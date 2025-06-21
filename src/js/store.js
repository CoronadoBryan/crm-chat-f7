import { createStore } from "framework7";
import api from "./api.js"; // Usar tu API en lugar de tools
import moment from "moment";

const store = createStore({
  state: {
    login: false,
    user: {},
    perfil: {},
    token: null,
  },
  getters: {
    sesionIniciada({ state }) {
      return state.login;
    },
    cuenta({ state }) {
      return state.user;
    },
    perfil({ state }) {
      return state.perfil;
    },
    isSudo({ state }) {
      return state.user.maestro === 1;
    },
  },
  actions: {
    async setUserInfo({ state, dispatch }, tokenDecode) {
      console.log("setUserInfo llamado con:", tokenDecode);

      try {
        // Usar tu API en lugar de tools
        const response = await api.get("/usuario/logueado");
        const data = response.data;

        console.log("Datos del usuario logueado:", data);

        if (data.success) {
          let datos = data["data"];

          state.login = tokenDecode["sub"] === datos["id"];

          if (state.login) {
            state.user = {
              id_user: datos.id,
              maestro: datos.sudo,
              usuario: datos.usuario,
              activo: datos.activo,
              bloqueado: datos.cuenta_bloqueada,
              force_pass: datos.forzar_cambio_pw || 0,
            };

            state.perfil = {
              nombres: datos.perfil?.["nombres"] || "",
              apellidos: datos.perfil?.["apellidos"] || "",
              nro_documento: datos.perfil?.["nro_documento"] || "",
              correo: datos.perfil?.["correo"] || "",
              celular: datos.perfil?.["celular"] || "",
            };

            console.log("Usuario configurado:", state.user);
            console.log("Perfil configurado:", state.perfil);

            // Abrir sistema
            dispatch("abrirSistema");

            return true;
          }
        } else {
          throw new Error("Error al obtener datos del usuario");
        }
      } catch (error) {
        console.error("Error en setUserInfo:", error);
        dispatch("cerrarSistema");
        return false;
      }
    },

    setToken({ state, dispatch }, token) {
      console.log("setToken llamado con:", token);

      if (!token) {
        dispatch("cerrarSistema");
        return false;
      }

      try {
        // Decodificar JWT manualmente
        const tokenParts = token.split(".");
        if (tokenParts.length !== 3) {
          throw new Error("Token inválido");
        }

        const payload = JSON.parse(atob(tokenParts[1]));
        console.log("Token decodificado:", payload);

        const momento_actual = moment().unix();
        const token_expire = payload.exp;
        const token_emision = payload.iat;
        const token_noantes = payload.nbf;

        if (
          token_emision === token_noantes &&
          token_noantes <= momento_actual &&
          momento_actual <= token_expire
        ) {
          // Guardar token
          localStorage.setItem("token", token);
          state.token = token;

          // Configurar información del usuario
          dispatch("setUserInfo", payload);

          return true;
        } else {
          throw new Error("Sesión expirada.");
        }
      } catch (ex) {
        console.error("Error procesando token:", ex);
        dispatch("cerrarSistema");

        if (window.app?.f7) {
          window.app.f7.notification
            .create({
              text: ex.message || "Error de autenticación",
            })
            .open();
        }

        return false;
      }
    },

    abrirSistema({ state }) {
      console.log("Abriendo sistema...");
      state.login = true;

      if (window.app?.f7) {
        window.app.f7.loginScreen.close("#login-screen");
      }
    },

    cerrarSistema({ state }) {
      console.log("Cerrando sistema...");

      state.login = false;
      state.user = {};
      state.perfil = {};
      state.token = null;

      localStorage.removeItem("token");

      if (window.app?.f7) {
        window.app.f7.loginScreen.open("#login-screen");
      }
    },
  },
});

export default store;
