import MessagesPage from "../pages/messages.f7";
import HistorialFinalizadoPage from "../pages/historial-finalizado.f7";
import Dashboard from "../pages/dashboard.f7";

var routes = [
  {
    path: "/dashboard",
    component: Dashboard,
  },
 
  {
    path: "/menu-modulos",
    panel: {
      componentUrl: "../pages/menu-modulos.f7",
    },
  },
  {
    path: '/usuario/perfil',
    panel: {
        componentUrl: '../pages/usuarios/perfil.f7',
        //            backdrop: true,
    },
  },
  {
    path: '/usuario/editar-perfil',
    componentUrl: '../pages/usuarios/editar-perfil.f7',
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
