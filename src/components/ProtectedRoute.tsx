
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/auth";

export const ProtectedRoute = () => {
  const { user, isLoading } = useAuth();

  // If auth is still loading, don't render anything yet
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  // If user is not authenticated, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If user is authenticated, render the child routes
  return <Outlet />;
};
