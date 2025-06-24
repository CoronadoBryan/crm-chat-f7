import MessagesPage from "../pages/messages.f7";
import HistorialFinalizadoPage from "../pages/historial-finalizado.f7";
import Dashboard from "../pages/dashboard.f7";
import ChatPage from "../pages/chat/principal.f7"; // ← AGREGAR ESTA LÍNEA

var routes = [
  {
    path: "/dashboard",
    component: Dashboard,
  },
  {
    path: "/chat", // ← AGREGAR ESTA RUTA
    component: ChatPage,
  },
  {
    path: "/menu-modulos",
    panel: {
      componentUrl: "../pages/menu-modulos.f7",
    },
  },
  {
    path: "/messages/:conversacionId/",
    component: MessagesPage,
  },
  {
    path: "/historial-finalizado/:conversacionId/",
    component: HistorialFinalizadoPage,
  },
];

export default routes;
