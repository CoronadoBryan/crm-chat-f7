import api from "../api.js";

export async function getPerfiles() {
  const res = await api.get("/cliente/perfil/listado");
  return res.data.data;
}