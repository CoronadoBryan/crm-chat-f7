import api from "../api.js";

export async function getConversaciones() {
  const res = await api.get("/conversacion/listadoTelefonos");
  return res.data.data;
}

export async function aceptarConversacion(conversacionId, usuarioId) {
  const res = await api.post("/conversacion/aceptar", {
    conversacionId,
    usuarioId,
  });
  return res.data;
}