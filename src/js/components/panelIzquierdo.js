// Importa solo lo que necesitas aquí
import { aceptarConversacion } from "../services/conversacionService.js";

export function panelIzquierdo({
  lista,
  conversaciones,
  clientes,
  perfiles,
  panelDerecho,
  $f7,
  onSeleccionar,
  conversacionSeleccionadaId,
}) {
  if (!lista) return;

  const usuarioId = Number(localStorage.getItem("usuarioId"));
  console.log("usuarioId desde localStorage:", usuarioId);

  console.log("Total conversaciones recibidas:", conversaciones.length);
  console.log("Conversaciones recibidas:", conversaciones);

  // Solo muestra las conversaciones asignadas a este usuario
  const conversacionesFiltradas = conversaciones.filter(
    (conv) =>
      conv.usuarioId == usuarioId && (conv.estadoId == 2 || conv.estadoId == 3)
  );

  console.log(
    "Conversaciones filtradas para usuarioId",
    usuarioId,
    ":",
    conversacionesFiltradas.length
  );
  console.log("Conversaciones filtradas:", conversacionesFiltradas);

  if (conversacionesFiltradas.length === 0) {
    lista.innerHTML = `
      <li class="item-content-center">
        <div class="item-inner" style="text-align: center; padding: 40px 20px;">
          <div class="text-color-gray" style="font-size: 14px; margin-top: 8px;">
            No tienes conversaciones asignadas.
          </div>
        </div>
      </li>`;
    return;
  }

  // Función para generar iniciales inteligentes
  const generarIniciales = (displayName, telefono) => {
    if (!displayName || displayName === "Sin número") {
      return telefono ? telefono.slice(-2) : "??";
    }

    // Si es un nombre completo (contiene espacio)
    if (displayName.includes(" ")) {
      const palabras = displayName.trim().split(" ");
      if (palabras.length >= 2) {
        return (palabras[0][0] + palabras[1][0]).toUpperCase();
      }
    }

    // Si es solo una palabra o teléfono
    return displayName.slice(0, 2).toUpperCase();
  };

  // Función para generar color de avatar
  const generarColorAvatar = (texto) => {
    const colores = [
      "#007aff",
      "#34c759",
      "#ff9500",
      "#5ac8fa",
      "#af52de",
      "#ff2d92",
      "#32d74b",
      "#5856d6",
    ];

    const codigo = texto
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colores[codigo % colores.length];
  };

  lista.innerHTML = conversacionesFiltradas
    .map((conv) => {
      const perfilCompleto =
        conv.nombreCliente &&
        conv.apellidoCliente &&
        conv.marcaCliente &&
        conv.modeloCliente &&
        conv.placaCliente;

      const displayName = perfilCompleto
        ? `${conv.nombreCliente} ${conv.apellidoCliente}`
        : conv.telefono ?? "Sin número";

      const iniciales = generarIniciales(displayName, conv.telefono);
      const colorAvatar = generarColorAvatar(displayName + conv.telefono);

      const isSelected = conv.conversacionId == conversacionSeleccionadaId;
      const mostrarNotificacion =
        conv.estadoMensajeUltNoLeido == 3 && conv.nroMensajesUltNoLeidos > 0;

      return `
      <li class="abrir-chat${
        isSelected ? " seleccionada" : ""
      }" data-conv-id="${
        conv.conversacionId
      }" style="cursor:pointer; background-color: ${
        isSelected ? "rgba(220, 53, 69, 0.15)" : "transparent"
      };">
        <div class="item-content">
          <div class="item-media">
            <div class="avatar" style="
              background: ${colorAvatar};
              width: 40px;
              height: 40px;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-weight: 600;
              font-size: 14px;
            ">
              ${iniciales}
            </div>
          </div>
          <div class="item-inner">
            <div class="item-title-row">
              <div class="item-title" style="font-weight: 500; color: var(--f7-text-color);">
                ${displayName}
              </div>
              <div class="item-after">
                ${
                  mostrarNotificacion
                    ? `<span class="badge color-red">${conv.nroMensajesUltNoLeidos}</span>`
                    : ""
                }
                <i class="icon f7-icons color-gray">chevron_right</i>
              </div>
            </div>
          </div>
        </div>
      </li>
    `;
    })
    .join("");

  lista.querySelectorAll(".abrir-chat").forEach((el) => {
    el.addEventListener("click", async (e) => {
      e.preventDefault();
      const convId = el.getAttribute("data-conv-id");
      if (onSeleccionar) onSeleccionar(convId);

      const conv = conversaciones.find((c) => c.conversacionId == convId);
      const usuarioId = Number(localStorage.getItem("usuarioId"));

      if (conv.usuarioId && conv.usuarioId != usuarioId) {
        $f7.dialog.alert("No tienes permiso para acceder a esta conversación.");
        return;
      }

      if (!convId || !usuarioId) {
        $f7.dialog.alert("No se puede aceptar la conversación: faltan datos.");
        return;
      }

      // ✅ Marcar visualmente como seleccionada ANTES de navegar
      document.querySelectorAll(".abrir-chat").forEach((item) => {
        item.classList.remove("seleccionada");
        item.style.backgroundColor = "transparent";
      });
      el.classList.add("seleccionada");
      el.style.backgroundColor = "rgba(220, 53, 69, 0.15)";

      console.log(`🔄 Navegando a conversación ${convId}`);

      // ✅ Verificar si ya estamos en una página de mensajes
      const currentRoute = $f7.views.main.router.currentRoute;
      const yaEnMensajes = currentRoute.path.includes("/messages/");

      // Desconecta el socket de la conversación actual si existe
      if (window.socket && typeof window.socket.disconnect === "function") {
        window.socket.disconnect();
        window.socket = null;
      }

      try {
        await aceptarConversacion(convId, usuarioId);

        // Obtener datos del cliente
        let cliente = null;
        let perfil = null;

        try {
          cliente = clientes.find((c) => c.telefono === conv.telefono);
          if (cliente) {
            perfil = perfiles.find((p) => p.id_cliente === cliente.id);
          }
        } catch (err) {
          console.error("Error buscando cliente/perfil:", err);
        }

        // Mostrar datos en el panel derecho
        const panelDatos = document.getElementById("panel-datos-cliente");
        if (panelDerecho && panelDatos) {
          panelDerecho(panelDatos, conv, perfil);
        }

        // ✅ ESTRATEGIA DE NAVEGACIÓN MEJORADA PARA FRAMEWORK7 CORE
        if (yaEnMensajes) {
          console.log("🔄 REEMPLAZANDO página de mensajes existente");

          $f7.views.main.router.navigate(`/messages/${convId}/`, {
            reloadAll: true,
            ignoreCache: true,
            force: true,
            replace: true,
            clearPreviousHistory: false,
            animate: false,
            // ✅ LIMPIAR CACHE DE PÁGINAS ANTERIORES
            on: {
              pageAfterIn: function() {
                // Limpiar páginas anteriores del DOM después de navegar
                const previousPages = document.querySelectorAll('.page-previous');
                previousPages.forEach(page => {
                  if (page.querySelector('.messages')) {
                    console.log("🧹 Limpiando página anterior del DOM");
                    page.remove();
                  }
                });
              }
            }
          });
        } else {
          console.log("➡️ NAVEGANDO a nueva página de mensajes");

          $f7.views.main.router.navigate(`/messages/${convId}/`, {
            reloadAll: true,
            ignoreCache: true,
            force: true,
            animate: false
          });
        }
      } catch (error) {
        console.error("❌ Error al aceptar conversación:", error);

        // ✅ Restaurar estado visual en caso de error
        el.classList.remove("seleccionada");
        el.style.backgroundColor = "transparent";

        $f7.dialog.alert(
          "Error al acceder a la conversación. Inténtalo de nuevo."
        );
      }
    });

    // ✅ Efectos hover mejorados
    el.addEventListener("mouseenter", () => {
      if (!el.classList.contains("seleccionada")) {
        el.style.backgroundColor = "rgba(255, 255, 255, 0.05)";
      }
    });

    el.addEventListener("mouseleave", () => {
      if (!el.classList.contains("seleccionada")) {
        el.style.backgroundColor = "transparent";
      }
    });
  });
}
