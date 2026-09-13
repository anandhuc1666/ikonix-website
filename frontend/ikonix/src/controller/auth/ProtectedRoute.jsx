import React from "react";
import {
  Navigate,
  Outlet,
  useLocation,
} from "react-router-dom";

function ProtectedRoute() {
  const location = useLocation();

  const token =
    localStorage.getItem("adminToken");

  // No admin token
  if (!token) {
    return (
      <Navigate
        to="/admin/login"
        replace
        state={{
          from: location.pathname,
        }}
      />
    );
  }

  // Admin is logged in
  return <Outlet />;
}

export default ProtectedRoute;