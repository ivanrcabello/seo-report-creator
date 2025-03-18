
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/auth";
import { useState, useEffect } from "react";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { routeAccessMap } from "@/utils/routesChecker";

interface ProtectedRouteProps {
  allowedRoles?: ("admin" | "client")[];
}

export const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const { user, userRole, isLoading } = useAuth();
  const [authError, setAuthError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const location = useLocation();

  // Helper function to check if a path matches a pattern with params
  const matchesPattern = (path: string, pattern: string): boolean => {
    const pathParts = path.split('/').filter(Boolean);
    const patternParts = pattern.split('/').filter(Boolean);
    
    if (pathParts.length !== patternParts.length) return false;
    
    return patternParts.every((part, i) => {
      if (part.startsWith(':')) return true; // This is a parameter, always matches
      return part === pathParts[i];
    });
  };

  // Check if the current route is allowed for the user's role
  const isRouteAllowed = (): boolean => {
    if (!userRole) return false;
    
    const path = location.pathname;
    
    // Find matching pattern in routeAccessMap
    for (const [pattern, roles] of Object.entries(routeAccessMap)) {
      if (matchesPattern(path, pattern) && roles.includes(userRole)) {
        return true;
      }
    }
    
    // Special case for dashboard with tabs
    if (path === '/dashboard' && location.search.includes('tab=')) {
      const tabParam = new URLSearchParams(location.search).get('tab');
      if (tabParam) {
        const tabRoute = `/${tabParam}`;
        for (const [pattern, roles] of Object.entries(routeAccessMap)) {
          if (matchesPattern(tabRoute, pattern) && roles.includes(userRole)) {
            return true;
          }
        }
      }
    }
    
    return false;
  };

  useEffect(() => {
    // Reset auth error if user is loaded successfully
    if (user && userRole) {
      setAuthError(null);
    }
  }, [user, userRole]);

  // Log route accesses for debugging
  useEffect(() => {
    console.log(`Route accessed: ${location.pathname}${location.search} by user role: ${userRole}`);
  }, [location.pathname, location.search, userRole]);

  // If still loading, show loading indicator
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p>Cargando...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // Check for client-specific paths that clients shouldn't access
  if (userRole === "client") {
    // Create new resources paths (clients can view but not create)
    const createResourcePaths = [
      "/invoices/new",
      "/contracts/new",
      "/proposals/new",
      "/reports/new"
    ];
    
    // Admin-only paths
    const adminOnlyPaths = [
      "/clients", 
      "/clients/new", 
      "/clients/edit",
      "/packages/edit",
      "/packages/new"
    ];
    
    // Check all restricted paths
    const isRestrictedPath = [
      ...adminOnlyPaths.map(path => location.pathname.startsWith(path)),
      ...createResourcePaths.map(path => location.pathname === path)
    ].some(result => result === true);
    
    if (isRestrictedPath) {
      return (
        <div className="flex h-screen items-center justify-center">
          <Alert variant="destructive" className="max-w-md">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Acceso denegado</AlertTitle>
            <AlertDescription>
              No tienes permisos para acceder a esta sección.
              <div className="mt-4">
                <Button variant="outline" onClick={() => window.location.href = "/dashboard"}>
                  Volver al dashboard
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        </div>
      );
    }
  }

  // If role restrictions are specified and user doesn't have an allowed role
  if (allowedRoles && userRole && !allowedRoles.includes(userRole)) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Acceso denegado</AlertTitle>
          <AlertDescription>
            No tienes permisos para acceder a esta sección.
            <div className="mt-4">
              <Button variant="outline" onClick={() => window.location.href = "/dashboard"}>
                Volver al dashboard
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // If there's an auth error, show the error
  if (authError) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error de autenticación</AlertTitle>
          <AlertDescription>
            {authError}
            <div className="mt-4">
              <Button 
                variant="outline" 
                onClick={() => {
                  setRetryCount(retryCount + 1);
                  setAuthError(null);
                }}
              >
                Reintentar
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // User is authenticated and has proper role, render the children
  return <Outlet />;
};
