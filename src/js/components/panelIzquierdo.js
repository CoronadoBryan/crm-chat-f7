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
      <li style="text-align: center; padding: 40px 20px;">
        <div style="color: #8e8e93; font-size: 14px; margin-top: 8px;">
          No tienes conversaciones asignadas.
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
      // Buscar cliente y perfil para cada conversación
      const cliente = clientes.find((c) => c.telefono === conv.telefono);
      const perfil = cliente
        ? perfiles.find((p) => p.id_cliente === cliente.id)
        : null;
      const perfilCompleto =
        perfil &&
        perfil.nombre &&
        perfil.apellido &&
        perfil.marca &&
        perfil.modelo &&
        perfil.placa;

      // Si perfil completo, mostrar nombre; si no, mostrar teléfono
      const displayName = perfilCompleto
        ? `${perfil.nombre} ${perfil.apellido}`
        : conv.telefono ?? "Sin número";

      // Generar iniciales y color mejorados
      const iniciales = generarIniciales(displayName, conv.telefono);
      const colorAvatar = generarColorAvatar(displayName + conv.telefono);

      const isSelected = conv.conversacionId == conversacionSeleccionadaId;
      const mostrarNotificacion =
        conv.estadoMensajeUltNoLeido == 3 && conv.nroMensajesUltNoLeidos > 0;

      return `
      <li class="abrir-chat${isSelected ? " seleccionada" : ""}" 
          data-conv-id="${conv.conversacionId}" 
          style="
            cursor: pointer; 
            background-color: ${
              isSelected ? "rgba(220, 53, 69, 0.15)" : "transparent"
            };
            display: flex;
            align-items: center;
            padding: 12px 16px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            transition: background-color 0.2s ease;
          ">
        
        <!-- Avatar -->
        <div style="
          background: ${colorAvatar};
          width: 44px;
          height: 44px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 600;
          font-size: 16px;
          margin-right: 12px;
          flex-shrink: 0;
        ">
          ${iniciales}
        </div>

        <!-- Contenido -->
        <div style="
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
        ">
          <!-- Fila superior: Nombre y badges -->
          <div style="
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 4px;
          ">
            <div style="
              font-weight: 500;
              color: rgba(255, 255, 255, 0.9);
              font-size: 15px;
              flex: 1;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            ">
              ${displayName}
            </div>
            
            <div style="display: flex; align-items: center; gap: 8px;">
              ${
                mostrarNotificacion
                  ? `
                <span style="
                  background: #dc3545;
                  color: white;
                  border-radius: 10px;
                  padding: 2px 6px;
                  font-size: 12px;
                  font-weight: 600;
                  min-width: 18px;
                  text-align: center;
                ">${conv.nroMensajesUltNoLeidos}</span>
              `
                  : ""
              }
              
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" style="opacity: 0.6;">
                <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
          </div>

          <!-- Fila inferior: Preview del último mensaje -->
          <div style="
            font-size: 13px;
            color: rgba(255, 255, 255, 0.6);
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          ">
            ${conv.ultimoMensaje || ""}
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

      // Marcar visualmente como seleccionada
      document.querySelectorAll(".abrir-chat").forEach((item) => {
        item.classList.remove("seleccionada");
        item.style.backgroundColor = "transparent";
      });
      el.classList.add("seleccionada");
      el.style.backgroundColor = "rgba(220, 53, 69, 0.15)";

      await aceptarConversacion(convId, usuarioId);

      // Buscar cliente y perfil
      let cliente = null;
      try {
        cliente = clientes.find((c) => c.telefono === conv.telefono);
      } catch (err) {
        console.error("Error buscando cliente:", err);
      }

      let perfil = null;
      if (cliente) {
        try {
          perfil = perfiles.find((p) => p.id_cliente === cliente.id);
        } catch (err) {
          console.error("Error buscando perfil:", err);
        }
      }

      // Mostrar datos en el panel derecho
      const panelDatos = document.getElementById("panel-datos-cliente");
      if (panelDerecho && panelDatos) {
        panelDerecho(panelDatos, conv, perfil);
      }

      // Navegar al chat
      $f7.views.main.router.navigate(`/messages/${convId}/`, {
        reloadAll: true,
      });
    });

    // Agregar efecto hover
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
