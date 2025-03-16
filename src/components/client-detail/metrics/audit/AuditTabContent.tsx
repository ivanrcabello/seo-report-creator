
import { Accordion } from "@/components/ui/accordion";
import { PageSpeedAudit } from "@/services/pagespeed";
import { AuditItem } from "./AuditItem";

interface AuditTabContentProps {
  audits: PageSpeedAudit[];
  emptyMessage?: string;
}

export const AuditTabContent = ({ audits, emptyMessage = "No hay auditorías en esta categoría" }: AuditTabContentProps) => {
  if (audits.length === 0) {
    return <p className="text-center py-4 text-gray-500">{emptyMessage}</p>;
  }
  
  return (
    <Accordion type="multiple" className="w-full">
      {audits.map((audit) => (
        <AuditItem key={audit.id} audit={audit} />
      ))}
    </Accordion>
  );
};
