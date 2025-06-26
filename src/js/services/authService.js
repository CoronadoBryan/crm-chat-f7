import config from "../config.js";

export async function login(credentials) {
  const res = await config.api.post("/auth/login", credentials);
  return res.data;
}

export async function logout() {
  const token = localStorage.getItem("token");
  const res = await config.api.post(
    "/auth/logout",
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
}

export async function changePassword(passwordData) {
  const res = await config.api.post("/auth/change-password", passwordData);
  return res.data;
}

export async function refreshToken() {
  const res = await config.api.post("/auth/refresh");
  return res.data;
}
