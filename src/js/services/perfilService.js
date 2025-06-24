import config from "../config.js";

export async function getPerfiles() {
  const res = await config.api.get("/cliente/perfil/listado");
  return res.data.data;
}