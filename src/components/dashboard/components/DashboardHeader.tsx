
import { Button } from "@/components/ui/button";
import { RefreshCw, Settings } from "lucide-react";
import { Link } from "react-router-dom";

interface DashboardHeaderProps {
  onRefresh: () => void;
}

export const DashboardHeader = ({ onRefresh }: DashboardHeaderProps) => {
  return (
    <div className="mb-8 flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold">Panel de Administración</h1>
        <p className="text-muted-foreground">
          Resumen de la actividad y acceso rápido a todas las funciones.
        </p>
      </div>
      <div className="space-x-2">
        <Button 
          variant="outline" 
          size="icon"
          onClick={onRefresh}
          title="Actualizar datos"
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
        <Button 
          variant="outline" 
          size="icon"
          title="Configuración"
          asChild
        >
          <Link to="/settings">
            <Settings className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
};
