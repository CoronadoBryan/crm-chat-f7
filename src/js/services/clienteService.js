import api from "../config.js";

export async function getClientes() {
  const res = await api.get("/cliente/listado");
  return res.data.data;
}