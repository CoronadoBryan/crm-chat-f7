import $ from "dom7";
import Framework7, { getDevice } from "framework7/bundle"; // ← Una sola importación

// Import F7 Styles
import "framework7/css/bundle";

// Import Icons and App Custom Styles
import "../css/icons.css";
import "../css/app.scss";


import capacitorApp from './capacitor-app.js';

// Import Routes
import routes from "./routes.js";
// Import Store
import store from "./store.js";

// Import main app component
import App from "../app.f7";

// Obtener device info
const device = getDevice();

var app = new Framework7({
  name: "CRM VIP2CARS", // App name
  theme: "auto", // Automatic theme detection

  el: "#app", // App root element
  component: App, // App main component
  // App store
  store: store,
  // App routes
  routes: routes,

  // Register service worker (only on production build)
  serviceWorker:
    process.env.NODE_ENV === "production"
      ? {
          path: "/service-worker.js",
        }
      : {},

  input: {
    scrollIntoViewOnFocus: device.capacitor,
    scrollIntoViewCentered: device.capacitor,
  },
  // Capacitor Statusbar settings
  statusbar: {
    iosOverlaysWebView: true,
    androidOverlaysWebView: false,
  },

  view: {
    componentCache: false,
    xhrCache: false,
  },
  dialog: {
    buttonCancel: "No",
    buttonOk: "Si",
  },

  notification: {
    title: "VIP2SYSTEM",
    icon: '<i class="icon f7-icons color-red size-50">exclamationmark_circle_fill</i>',
    closeTimeout: 5000,
    closeButton: true,
  },

  popover: {
    closeOnEscape: true,
    backdrop: true,
  },

  on: {
    init: function () {
      var f7 = this;

      // Verificar si config está disponible
      if (typeof config !== "undefined") {
        f7.config = config;
      }

      // Verificar si tools está disponible
      if (typeof tools !== "undefined") {
        f7.tools = tools;
      }

      if (!f7.config?.mode) {
        console.warn("Config Mode no está definido.");
      } else if (f7.config.mode === "development") {
        f7.$("#modewarning").css("display", "flex");
      }

      if (f7.device.capacitor) {
        // Init capacitor APIs (si capacitorApp está disponible)
        if (typeof capacitorApp !== "undefined") {
          capacitorApp.init(f7);
        }
      }
    },
    pageInit: function (page) {
      var f7 = page.app;

      // Validar que exista un token almacenado en el navegador del usuario
      let token = localStorage.getItem("token");
      let store = f7.store;

      store.dispatch("setToken", token);
    },
  },
});

export default app;
