import { createContext, useContext, useEffect, useMemo, useState } from "react";
import config, { apiBase } from "../config.jsx";
import {
  clearSession,
  getRefreshToken,
  getStoredUsuario,
  isAuthenticated,
  saveSession,
} from "./session.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(() => getStoredUsuario());
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const sync = () => {
      setUsuario(getStoredUsuario());
      setReady(true);
    };
    sync();
    window.addEventListener("allforone:session", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("allforone:session", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const value = useMemo(
    () => ({
      usuario,
      ready,
      isAuthenticated: isAuthenticated(),
      loginSession: (session) => {
        saveSession(session);
        setUsuario(session.usuario || getStoredUsuario());
      },
      logout: async () => {
        const refreshToken = getRefreshToken();
        try {
          if (refreshToken) {
            await fetch(`${apiBase}${config.services.auth.endpoints.logout}`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ refreshToken }),
            });
          }
        } catch {
          // ignore network errors on logout
        }
        clearSession();
        setUsuario(null);
      },
    }),
    [usuario, ready],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider");
  }
  return ctx;
}
