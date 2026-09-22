const ACCESS_KEY = "allforone_access_token";
const REFRESH_KEY = "allforone_refresh_token";
const USER_KEY = "usuario";

export function getAccessToken() {
  return localStorage.getItem(ACCESS_KEY);
}

export function getRefreshToken() {
  return localStorage.getItem(REFRESH_KEY);
}

export function getStoredUsuario() {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveSession({ usuario, accessToken, refreshToken }) {
  if (usuario !== undefined) {
    localStorage.setItem(USER_KEY, JSON.stringify(usuario));
  }
  if (accessToken) localStorage.setItem(ACCESS_KEY, accessToken);
  if (refreshToken) localStorage.setItem(REFRESH_KEY, refreshToken);
  window.dispatchEvent(new Event("allforone:session"));
}

export function clearSession() {
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
  window.dispatchEvent(new Event("allforone:session"));
}

export function isAuthenticated() {
  return Boolean(getAccessToken() && getStoredUsuario());
}
