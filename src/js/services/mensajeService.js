import config from "../config.js";

export async function getMensajesPorConversacion(conversacionId) {
  const res = await config.api.get(
    `/mensaje/listar-por-conversacion/${conversacionId}`
  );
  console.log("Respuesta de mensajes:", res.data);
  return res.data.data;
}

export async function enviarMensaje(payload) {
  const res = await config.api.post(
    "/mensaje/crear-y-enviar-whatsapp",
    payload
  );
  return res.data;
}

export async function mensajeLeido(mensajeId) {
  const res = await config.api.put(`/mensaje/marcar-leido/${mensajeId}`);
  return res.data;
}

export async function reenviarMensaje(mensajeId) {
  const res = await config.api.post(`/mensaje/reenviar/${mensajeId}`);
  console.log(`Reenviando mensaje con ID: ${mensajeId}`, res.data);
  return res.data;
}

export async function getPlantillasPorCategoria() {
  const res = await config.api.get("/mensaje/plantilla/listarPorCategoria");
  console.log("Respuesta de plantillas:", res.data);
  return res.data;
}

export async function getAtajos() {
  const res = await config.api.get("/mensaje/atajo/listado");
  return res.data.data;
}

export async function reemplazarAtajosEnMensaje(mensaje, id_conversacion) {
  const res = await config.api.post(
    "/mensaje/atajo/probar-reemplazo",
    { mensaje, id_conversacion }
  );
  return res.data.procesado || mensaje;
}