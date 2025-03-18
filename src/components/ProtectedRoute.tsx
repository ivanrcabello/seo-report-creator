
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Spinner } from "@/components/ui/spinner";
import logger from "@/services/logService";

// Logger específico para ProtectedRoute
const routeLogger = logger.getLogger('ProtectedRoute');

export function ProtectedRoute() {
  const { user, isLoading } = useAuth();

  routeLogger.debug("ProtectedRoute evaluando", { 
    isLoading, 
    isAuthenticated: !!user,
    userId: user?.id
  });

  if (isLoading) {
    routeLogger.debug("Autenticación en progreso, mostrando spinner");
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <Spinner className="mx-auto mb-4" />
          <p className="text-gray-500">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    routeLogger.warn("Usuario no autenticado, redirigiendo a login");
    return <Navigate to="/login" replace />;
  }

  routeLogger.debug("Usuario autenticado, permitiendo acceso");
  return <Outlet />;
}
