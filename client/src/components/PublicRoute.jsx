import React from "react";
import { Navigate, Outlet } from "react-router";
import useAuthStore from "../store/authStore.js";

const PublicRoute = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (isAuthenticated) {
    return <Navigate to="/home" replace />;
  }

  return <Outlet />;
};

export default PublicRoute;
