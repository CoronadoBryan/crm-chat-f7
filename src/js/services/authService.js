import config from "../config.js";

export async function login(credentials) {
  const res = await config.api.post("/auth/login", credentials);
  return res.data;
}

export async function logout() {
  const res = await config.api.get("/auth/logout");
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