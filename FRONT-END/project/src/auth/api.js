import { apiBase } from "../config.jsx";
import config from "../config.jsx";
import {
  clearSession,
  getAccessToken,
  getRefreshToken,
  saveSession,
} from "./session.js";

let refreshPromise = null;

async function refreshAccessToken() {
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      clearSession();
      return null;
    }

    const res = await fetch(`${apiBase}${config.services.auth.endpoints.refresh}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    if (!res.ok) {
      clearSession();
      return null;
    }

    const data = await res.json();
    if (!data.accessToken) {
      clearSession();
      return null;
    }

    saveSession({
      usuario: data.usuario,
      accessToken: data.accessToken,
      refreshToken: data.refreshToken || refreshToken,
    });
    return data.accessToken;
  })().finally(() => {
    refreshPromise = null;
  });

  return refreshPromise;
}

export async function apiFetch(path, options = {}) {
  const url = path.startsWith("http") ? path : `${apiBase}${path}`;
  const headers = new Headers(options.headers || {});

  if (!headers.has("Content-Type") && options.body && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  const token = getAccessToken();
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  let res = await fetch(url, { ...options, headers });

  if (res.status === 401 && getRefreshToken()) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      headers.set("Authorization", `Bearer ${newToken}`);
      res = await fetch(url, { ...options, headers });
    }
  }

  return res;
}
