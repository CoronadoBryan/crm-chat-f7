import api from "../api.js";

export async function getMensajesPorConversacion(conversacionId) {
  const res = await api.get(`/mensaje/listar-por-conversacion/${conversacionId}`);
  return res.data.data;
}

export async function enviarMensaje(payload) {
  const res = await api.post("/mensaje/crear-y-enviar-whatsapp", payload);
  return res.data;
}

export async function mensajeLeido(mensajeId) {
  const res = await api.put(`/mensaje/marcar-leido/${mensajeId}`);
  return res.data;
}