
import { Accordion } from "@/components/ui/accordion";
import { PageSpeedAudit } from "@/services/pagespeed";
import { AuditItem } from "./AuditItem";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";

interface AuditTabContentProps {
  audits: PageSpeedAudit[];
  emptyMessage?: string;
}

export const AuditTabContent = ({ 
  audits, 
  emptyMessage = "No hay auditorías en esta categoría" 
}: AuditTabContentProps) => {
  if (audits.length === 0) {
    return (
      <Alert variant="default" className="bg-gray-50 border-gray-200">
        <InfoIcon className="h-4 w-4 text-gray-500" />
        <AlertDescription className="text-gray-500">
          {emptyMessage}
        </AlertDescription>
      </Alert>
    );
  }
  
  return (
    <Accordion type="multiple" className="w-full">
      {audits.map((audit) => (
        <AuditItem key={audit.id} audit={audit} />
      ))}
    </Accordion>
  );
};
