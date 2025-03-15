
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  allowedRoles?: ("admin" | "client")[];
}

export const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const { user, userRole, isLoading } = useAuth();

  // If still loading, show nothing
  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Cargando...</div>;
  }

  // If not authenticated, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If role restrictions are specified and user doesn't have an allowed role
  if (allowedRoles && userRole && !allowedRoles.includes(userRole)) {
    return <Navigate to="/dashboard" replace />;
  }

  // User is authenticated and has proper role, render the children
  return <Outlet />;
};
