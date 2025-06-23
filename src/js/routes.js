
import MessagesPage from "../pages/messages.f7";
import HistorialFinalizadoPage from "../pages/historial-finalizado.f7";
import RequestAndLoad from "../pages/request-and-load.f7";

var routes = [

  {
    path: "/messages/:conversacionId/",
    component: MessagesPage,
  },
  {
    path: "/historial-finalizado/:conversacionId/",
    component: HistorialFinalizadoPage,
  },

  {
    path: "/request-and-load/user/:userId/",
    async: function ({ router, to, resolve }) {
      // App instance
      var app = router.app;

      // Show Preloader
      app.preloader.show();

      // User ID from request
      var userId = to.params.userId;

      // Simulate Ajax Request
      setTimeout(function () {
        // We got user data from request
        var user = {
          firstName: "Vladimir",
          lastName: "Kharlampidi",
          about: "Hello, i am creator of Framework7! Hope you like it!",
          links: [
            {
              title: "Framework7 Website",
              url: "http://framework7.io",
            },
            {
              title: "Framework7 Forum",
              url: "http://forum.framework7.io",
            },
          ],
        };
        // Hide Preloader
        app.preloader.hide();

        // Resolve route to load page
        resolve(
          {
            component: RequestAndLoad,
          },
          {
            props: {
              user: user,
            },
          }
        );
      }, 1000);
    },
  },

];

export default routes;
