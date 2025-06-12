import api from "../api.js";

export async function getClientes() {
  const res = await api.get("/cliente/listado");
  return res.data.data;
}