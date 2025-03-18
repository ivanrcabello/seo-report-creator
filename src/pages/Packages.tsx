
import { useState, useEffect, useCallback } from "react";
import { useLogger } from "@/hooks/useLogger";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PackageList } from "@/components/packages/PackageList";
import { Pack } from "@/types/client";
import { getAllSeoPacks } from "@/services/packService";
import { toast } from "sonner";

const Packages = () => {
  const logger = useLogger("PackagesPage");
  const [isLoading, setIsLoading] = useState(true);
  const [packages, setPackages] = useState<Pack[]>([]);

  const fetchPackages = useCallback(async () => {
    try {
      setIsLoading(true);
      const packs = await getAllSeoPacks();
      setPackages(packs);
    } catch (error) {
      console.error("Error loading packages:", error);
      toast.error("No se pudieron cargar los paquetes");
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  useEffect(() => {
    logger.info("Packages page loaded");
    fetchPackages();
    
    return () => {
      // Cleanup if needed
    };
  }, [logger, fetchPackages]);

  const handleEdit = (pack: Pack) => {
    console.log("Edit package:", pack.id);
  };

  const handleDelete = (pack: Pack) => {
    console.log("Delete package:", pack.id);
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
