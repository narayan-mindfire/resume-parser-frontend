import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import type { JSX } from "react";

const LOGOUT_REDIRECT_PATH = "/";

export const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { currentUser } = useAuth();
  const location = useLocation();

  if (!currentUser) {
    if (location.pathname === "/me") {
      return (
        <Navigate
          to={LOGOUT_REDIRECT_PATH}
          state={{ from: location }}
          replace
        />
      );
    }
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
};
