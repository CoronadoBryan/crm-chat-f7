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
    path: '/usuario/cambiar-contraseña',
      panel : {
        componentUrl: '../pages/usuarios/cambiar-contraseña.f7',
    },
  },
  {
    path: '/sistema/configuraciones',
    panel: {
        componentUrl: '../pages/sistema/configuraciones.f7',
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

  //permisos y roles
  
  {
      path: '/sistema/citas',
      componentUrl: '../pages/citas/index.f7',
  },
  {
      path: '/sistema/permisos',
      componentUrl: '../pages/sistema/permisos/index.f7',
  },
  {
      name: 'sistema_citadetalles',
      path: '/sistema/cita/citadetalle',
      popup: {
          componentUrl: '../pages/citas/citadetalle.f7'
      }
  },
  {
      name: 'popup-editar',
      path: '/sistema/citas/editar',
      popup: {
          componentUrl: '../pages/citas/editar.f7'
      }
  },
  {
      path: '/sistema/cita/espacios',
      componentUrl: '../pages/citas/espacios.f7',
  },
  {
      path: '/no-autorizado',
      componentUrl: '../pages/acceso-denegado.f7',
  }

];

export default routes;
