
import { useState, useEffect } from "react";
import { useLogger } from "@/hooks/useLogger";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Contracts = () => {
  const logger = useLogger("ContractsPage");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    logger.info("Contracts page loaded");
    
    // Simulamos la carga de datos
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [logger]);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Gestión de Contratos</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Contratos activos</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-700"></div>
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-gray-500 mb-4">No hay contratos activos en este momento.</p>
              <button className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition-colors">
                Crear nuevo contrato
              </button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Contracts;
