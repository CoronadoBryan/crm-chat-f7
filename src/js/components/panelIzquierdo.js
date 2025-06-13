export function panelIzquierdo({
  lista,
  conversaciones,
  clientes,
  perfiles,
  panelDerecho,
  $f7
}) {
  if (!lista) return;

  if (conversaciones.length === 0) {
    lista.innerHTML = `
      <li class="item-content-center">
        <div class="item-inner" style="text-align: center; padding: 40px 20px;">
          <div class="text-color-gray" style="font-size: 14px; margin-top: 8px;">
            Las nuevas conversaciones aparecerán aquí
          </div>
        </div>
      </li>`;
    return;
  }

  lista.innerHTML = conversaciones
    .map((conv) => {
      // Buscar cliente y perfil para cada conversación
      const cliente = clientes.find(c => c.telefono === conv.telefono);
      const perfil = cliente ? perfiles.find(p => p.id_cliente === cliente.id) : null;
      const perfilCompleto = perfil && perfil.nombre && perfil.apellido && perfil.marca && perfil.modelo && perfil.placa;

      // Si perfil completo, mostrar nombre; si no, mostrar teléfono
      const displayName = perfilCompleto
        ? `${perfil.nombre} ${perfil.apellido}`
        : conv.telefono ?? "Sin número";

      console.log(`[panelIzquierdo] convId: ${conv.conversacionId}, telefono: ${conv.telefono}, perfilCompleto: ${perfilCompleto}, displayName: ${displayName}`);

      return `
      <li class="abrir-chat" data-conv-id="${conv.conversacionId}" style="cursor:pointer;">
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
      const conv = conversaciones.find((c) => c.conversacionId == convId);

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