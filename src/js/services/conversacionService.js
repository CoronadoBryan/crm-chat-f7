import api from "../config.js";

export async function getConversaciones() {
  const res = await api.get("/conversacion/listadoTelefonos");
  // console.log("Conversaciones obtenidas:", res.data.data);
  return res.data.data;
}

export async function aceptarConversacion(conversacionId, usuarioId) {
  const res = await api.post("/conversacion/aceptar", {
    conversacionId,
    usuarioId,
  });
  return res.data;
}

export async function finalizarConversacion(conversacionId , usuarioId) {
  const res = await api.post("/conversacion/finalizar", {
    conversacionId,
    usuarioId,
  });
  return res.data;
}
