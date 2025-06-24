import config from "../config.js";

export async function getClientes() {
  const res = await config.api.get("/cliente/listado");
  return res.data.data;
}