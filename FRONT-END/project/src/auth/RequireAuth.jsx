import { Navigate, useLocation } from "react-router-dom";
import config from "../config.jsx";
import { useAuth } from "./AuthContext.jsx";

export default function RequireAuth({ children }) {
  const { isAuthenticated, ready } = useAuth();
  const location = useLocation();

  if (!ready) {
    return (
      <div className="container py-5 text-center text-muted">
        Carregando sessão...
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to={config.services.auth.endpoints.login}
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  return children;
}
