
import MessagesPage from "../pages/messages.f7";
import HistorialFinalizadoPage from "../pages/historial-finalizado.f7";
import Dashboard from "../pages/dashboard.f7";


var routes = [

   {
      path: '/dashboard',
      component: Dashboard,
  },
  {
      path: '/menu-modulos',
      panel: {
          componentUrl: '../pages/menu-modulos.f7',
          //            backdrop: true,
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
