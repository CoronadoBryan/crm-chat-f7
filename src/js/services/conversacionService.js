import api from "../api.js";

export async function getConversaciones() {
  const res = await api.get("/conversacion/listadoTelefonos");
  return res.data.data;
}