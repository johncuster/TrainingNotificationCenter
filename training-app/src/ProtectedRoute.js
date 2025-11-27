// ProtectedRoute.js
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();   

  if (!user) {
    // User not logged in
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(user.user_role)) {
    // Logged in but doesn't have permission
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
