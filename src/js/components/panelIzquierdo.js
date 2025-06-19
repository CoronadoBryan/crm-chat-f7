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
  conversacionSeleccionadaId
}) {
  if (!lista) return;

  const usuarioId = Number(localStorage.getItem("usuarioId"));
  console.log("usuarioId desde localStorage:", usuarioId);

  console.log("Total conversaciones recibidas:", conversaciones.length);
  console.log("Conversaciones recibidas:", conversaciones);

  // Solo muestra las conversaciones asignadas a este usuario
  const conversacionesFiltradas = conversaciones.filter(conv =>
    conv.usuarioId == usuarioId && (conv.estadoId == 2 || conv.estadoId == 3)
  );

  console.log("Conversaciones filtradas para usuarioId", usuarioId, ":", conversacionesFiltradas.length);
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

  lista.innerHTML = conversacionesFiltradas
    .map((conv) => {
      // Buscar cliente y perfil para cada conversación
      const cliente = clientes.find(c => c.telefono === conv.telefono);
      const perfil = cliente ? perfiles.find(p => p.id_cliente === cliente.id) : null;
      const perfilCompleto = perfil && perfil.nombre && perfil.apellido && perfil.marca && perfil.modelo && perfil.placa;

      // Si perfil completo, mostrar nombre; si no, mostrar teléfono
      const displayName = perfilCompleto
        ? `${perfil.nombre} ${perfil.apellido}`
        : conv.telefono ?? "Sin número";

      const isSelected = conv.conversacionId == conversacionSeleccionadaId;
      const mostrarNotificacion = conv.estadoMensajeUltNoLeido == 3 && conv.nroMensajesUltNoLeidos > 0;
      return `
      <li class="abrir-chat${isSelected ? ' seleccionada' : ''}" data-conv-id="${conv.conversacionId}" style="cursor:pointer; background-color: ${isSelected && 'rgba(100, 112, 238, 0.64)'};">
        <div class="item-content">
          <div class="item-media">
            <div class="avatar color-blue" style="background: linear-gradient(45deg, #007aff, #5856d6);">
              <span style="font-weight: 600;">${displayName.slice(-2)}</span>
            </div>
          </div>
          <div class="item-inner">
            <div class="item-title-row">
              <div class="item-title" style="font-weight: 500; color: var(--f7-text-color);">
                ${displayName}
                ${mostrarNotificacion ? `<span class="badge-notificacion">${conv.nroMensajesUltNoLeidos}</span>` : ""}
              </div>
              <div class="item-after">
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
      const conv = conversaciones.find(c => c.conversacionId == convId);
      const usuarioId = Number(localStorage.getItem("usuarioId"));

    

      // Solo permitir si corresponde
      if (conv.usuarioId && conv.usuarioId != usuarioId) {
        $f7.dialog.alert("No tienes permiso para acceder a esta conversación.");
        return;
      }

      if (!convId || !usuarioId) {
        $f7.dialog.alert("No se puede aceptar la conversación: faltan datos.");
        return;
      }

      // Aquí defines conv:

      await aceptarConversacion(convId, usuarioId);

      // Buscar cliente y perfil
      let cliente = null;
      try {
        cliente = clientes.find(c => c.telefono === conv.telefono);
      } catch (err) {
        console.error("Error buscando cliente:", err);
      }

      let perfil = null;
      if (cliente) {
        try {
          perfil = perfiles.find(p => p.id_cliente === cliente.id);
        } catch (err) {
          console.error("Error buscando perfil:", err);
        }
      }

      // Mostrar datos en el panel derecho
      const panelDatos = document.getElementById("panel-datos-cliente");
      panelDerecho(panelDatos, conv, perfil);

      // Navega al chat si quieres
      $f7.views.main.router.navigate(`/messages/${convId}/`, {
        reloadAll: true,
      });
    });
  });
}