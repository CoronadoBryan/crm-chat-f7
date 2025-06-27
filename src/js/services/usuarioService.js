import config from "../config.js";

export async function cambiarEstadoUsuario(estado) {
  const token = localStorage.getItem("token");
  const id_usuario = localStorage.getItem("usuarioId");
  const res = await config.api.post(
    "/usuario/cambiar-estado",
    { id_usuario, estado },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
}

export async function getEstadoUsuario(id_usuario) {
  const token = localStorage.getItem("token");
  const res = await config.api.get(`/usuario/estado/${id_usuario}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
}

export async function getUsuarioById(id_usuario) {
  const token = localStorage.getItem("token");
  const res = await config.api.get(`/usuario/${id_usuario}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
}

window.getUsuarioById = getUsuarioById;
