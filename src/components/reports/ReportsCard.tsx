
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { ReportsList } from "./ReportsList";
import { ClientReport } from "@/types/client";

interface ReportsCardProps {
  title: string;
  description: string;
  reports: ClientReport[];
  filteredCount: number;
  isLoading: boolean;
  error: string | null;
  handleRetry: () => void;
  searchTerm: string;
  selectedType: string;
  setSearchTerm: (value: string) => void;
  setSelectedType: (value: string) => void;
  isAdmin: boolean;
}

export const ReportsCard = ({
  title,
  description,
  reports,
  filteredCount,
  isLoading,
  error,
  handleRetry,
  searchTerm,
  selectedType,
  setSearchTerm,
  setSelectedType,
  isAdmin,
}: ReportsCardProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{title} ({filteredCount})</CardTitle>
          {!isLoading && (
            <Button variant="outline" size="sm" onClick={handleRetry} className="flex items-center gap-1">
              <RefreshCw className="h-4 w-4" />
              Actualizar
            </Button>
          )}
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ReportsList
          reports={reports}
          isLoading={isLoading}
          error={error}
          handleRetry={handleRetry}
          searchTerm={searchTerm}
          selectedType={selectedType}
          setSearchTerm={setSearchTerm}
          setSelectedType={setSelectedType}
          isAdmin={isAdmin}
        />
      </CardContent>
    </Card>
  );
};
