import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ClientReport } from "@/types/client";
import { getFilteredReports } from "@/services/reportService";
import { toast } from "sonner";
import { ReportFilters, ReportsHeader, ReportsCard } from "@/components/reports";
import { useAuth } from "@/contexts/auth";

export const AllReports = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState<ClientReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [reportTypes, setReportTypes] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState<string>("all");
  const [error, setError] = useState<string | null>(null);
  const { user, isAdmin } = useAuth();
  
  const loadReports = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log("Loading reports for user:", user?.id, "isAdmin:", isAdmin);
      const allReports = await getFilteredReports(user?.id, isAdmin);
      console.log("Reports loaded:", allReports);
      setReports(allReports);
      
      // Filter out null, undefined, or empty string values before creating the set
      const types = Array.from(
        new Set(
          allReports
            .map(report => report.type)
            .filter(type => type && type.trim() !== "")
        )
      ) as string[];
      
      console.log("Report types extracted:", types);
      setReportTypes(types);
    } catch (err) {
      console.error("Error loading reports:", err);
      setError("No se pudieron cargar los informes. Por favor, inténtalo de nuevo más tarde.");
      toast.error("No se pudieron cargar los informes.");
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    loadReports();
  }, [user, isAdmin]);
  
  const filteredReports = reports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === "all" || report.type === selectedType;
    return matchesSearch && matchesType;
  });

  const handleRetry = () => {
    loadReports();
  };

  const handleGoBack = () => {
    navigate("/dashboard");
  };

  return (
    <div className="container mx-auto py-8">
      <ReportsHeader 
        isAdmin={isAdmin} 
        handleGoBack={handleGoBack} 
        handleRetry={handleRetry}
        isLoading={isLoading}
      />
      
      <ReportFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedType={selectedType}
        setSelectedType={setSelectedType}
        reportTypes={reportTypes}
      />
      
      <ReportsCard
        title="Informes"
        description="Lista completa de informes generados"
        reports={reports}
        filteredCount={filteredReports.length}
        isLoading={isLoading}
        error={error}
        handleRetry={handleRetry}
        searchTerm={searchTerm}
        selectedType={selectedType}
        setSearchTerm={setSearchTerm}
        setSelectedType={setSelectedType}
        isAdmin={isAdmin}
      />
    </div>
  );
};

export default AllReports;
