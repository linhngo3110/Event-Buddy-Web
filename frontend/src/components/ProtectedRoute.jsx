import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useApp } from "../context/AppContext";

const ProtectedRoute = ({ allowedRole, children }) => {
  const { currentUser } = useApp();

  // If user is not logged in
  if (!currentUser) {
    if (allowedRole === "club") {
      return <Navigate to="/admin-login" replace />;
    }
    return <Navigate to="/login" replace />;
  }

  // If user is logged in but role does not match
  if (currentUser.role !== allowedRole) {
    if (allowedRole === "admin") {
      return <Navigate to="/admin-login" replace />;
    }
    return <Navigate to="/login" replace />;
  }

  // Render children or nested routes
  return children ? children : <Outlet />;
};

export default ProtectedRoute;
