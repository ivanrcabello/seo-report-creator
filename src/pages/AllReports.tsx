
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLogger } from "@/hooks/useLogger";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReportsHeader } from "@/components/reports/ReportsHeader";
import { ReportsList } from "@/components/reports/ReportsList";

const AllReports = () => {
  const logger = useLogger("ReportsPage");
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [reports, setReports] = useState([]);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");

  useEffect(() => {
    logger.info("Reports page loaded");
    
    // Simulamos la carga de datos
    const timer = setTimeout(() => {
      setIsLoading(false);
      // Aquí se cargarían los informes reales
      setReports([]);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [logger]);

  const handleGoBack = () => {
    navigate('/dashboard');
  };

  const handleRetry = () => {
    setIsLoading(true);
    // Simulamos recarga
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="container mx-auto py-8">
      <ReportsHeader 
        isAdmin={true} 
        handleGoBack={handleGoBack} 
        handleRetry={handleRetry} 
        isLoading={isLoading} 
      />
      
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Informes</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-700"></div>
            </div>
          ) : (
            <ReportsList 
              reports={reports}
              isLoading={isLoading}
              error={error}
              handleRetry={handleRetry}
              searchTerm={searchTerm}
              selectedType={selectedType}
              setSearchTerm={setSearchTerm}
              setSelectedType={setSelectedType}
              isAdmin={true}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AllReports;
