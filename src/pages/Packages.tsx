
import { useState, useEffect } from "react";
import { useLogger } from "@/hooks/useLogger";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PackageList } from "@/components/packages/PackageList";

const Packages = () => {
  const logger = useLogger("PackagesPage");
  const [isLoading, setIsLoading] = useState(true);
  const [packages, setPackages] = useState([]);

  useEffect(() => {
    logger.info("Packages page loaded");
    
    // Simulamos la carga de datos
    const timer = setTimeout(() => {
      setIsLoading(false);
      // Aquí se cargarían los paquetes reales
      setPackages([]);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [logger]);

  const handleEdit = (id: string) => {
    console.log("Edit package:", id);
  };

  const handleDelete = (id: string) => {
    console.log("Delete package:", id);
  };

  const handleCreate = () => {
    console.log("Create new package");
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Paquetes de Servicio</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Paquetes Disponibles</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-700"></div>
            </div>
          ) : (
            <PackageList 
              packages={packages}
              isLoading={isLoading}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onCreate={handleCreate}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Packages;
