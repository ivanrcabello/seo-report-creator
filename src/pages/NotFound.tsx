
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center bg-white p-8 rounded-lg shadow-md max-w-md">
        <h1 className="text-5xl font-bold mb-4 text-red-500">404</h1>
        <p className="text-xl text-gray-600 mb-6">Página no encontrada</p>
        <p className="text-gray-500 mb-6">
          Lo sentimos, la ruta <span className="font-mono bg-gray-100 px-2 py-1 rounded">{location.pathname}</span> no existe.
        </p>
        <Button asChild className="flex items-center gap-2">
          <Link to="/">
            <Home className="h-4 w-4" />
            Volver al inicio
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
