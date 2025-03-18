
import { useState, useEffect } from "react";
import { useLogger } from "@/hooks/useLogger";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReportsHeader } from "@/components/reports/ReportsHeader";
import { ReportsList } from "@/components/reports/ReportsList";

const AllReports = () => {
  const logger = useLogger("ReportsPage");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    logger.info("Reports page loaded");
    
    // Simulamos la carga de datos
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [logger]);

  return (
    <div className="container mx-auto py-8">
      <ReportsHeader />
      
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
            <ReportsList />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AllReports;
