
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/auth";

export const ProtectedRoute = () => {
  const { user, isLoading } = useAuth();

  console.log("ProtectedRoute - Auth state:", { isAuthenticated: !!user, isLoading });

  // If auth is still loading, show a loading spinner
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
        <p className="ml-2">Loading...</p>
      </div>
    );
  }

  // If user is not authenticated, redirect to login
  if (!user) {
    console.log("User not authenticated, redirecting to login");
    return <Navigate to="/login" replace />;
  }

  // If user is authenticated, render the child routes
  console.log("User is authenticated, rendering protected content");
  return <Outlet />;
};
