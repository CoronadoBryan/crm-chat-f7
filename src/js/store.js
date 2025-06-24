import { createStore } from "framework7";
import tools from "./tools.js";
import moment from "moment";

const store = createStore({
  state: {
    login: false,
    user: {},
    perfil: {},
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
    setUserInfo({ state, dispatch }, tokenDecode) {
      let userInfo = tools.sendRequest("GET", "/usuario/logueado");

      userInfo.then((data) => {
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
              force_pass: 1,
            };

            state.perfil = {
              nombres: datos.perfil["nombres"],
              apellidos: datos.perfil["apellidos"],
              nro_documento: datos.perfil["nro_documento"],
              correo: datos.perfil["correo"],
              celular: datos.perfil["celular"],
            };

            // GUARDAR EL USUARIO ID EN LOCALSTORAGE
            localStorage.setItem("usuarioId", datos.id);
            console.log("UsuarioId guardado en localStorage:", datos.id);

            /*RETORNAR*/
            if (datos.forzar_cambio_pw == 1) {
              return dispatch("/cambiar-password/");
            } else {
              return dispatch("abrirSistema");
            }
          }
        }

        dispatch("cerrarSistema");
      });
    },
    setToken({ state, dispatch }, token) {
      if (token === null) {
        dispatch("cerrarSistema");

        return false;
      }

      try {
        let tokenDecode = tools.parseJwt(token);

        if (tokenDecode === false) {
          throw new Error("TOKEN invalido.");
        }

        let token_emision = tokenDecode.iat;
        let token_noantes = tokenDecode.nbf;
        let token_expire = tokenDecode.exp;
        let momento_actual = moment().unix();

        if (
          token_emision === token_noantes &&
          token_noantes <= momento_actual &&
          momento_actual <= token_expire
        ) {
          localStorage.setItem("token", token);

          dispatch("setUserInfo", tokenDecode);

          return tokenDecode !== false;
        } else {
          throw new Error("Sesión expirada.");
        }
      } catch (ex) {
        dispatch("cerrarSistema");

        if (token !== null) {
          app.f7.notification.create({ text: ex }).open();
        }
      }

      return false;
    },
    abrirSistema({ state }) {
      app.f7.loginScreen.close();
    },
    cerrarSistema({ state }) {
      //            state.token = null;
      state.user = {};
      state.perfil = {};

      localStorage.removeItem("token");

      app.f7.loginScreen.open("#login-screen");
    },
  },
});
export default store;
