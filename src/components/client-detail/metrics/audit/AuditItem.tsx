
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { PageSpeedAudit } from "@/services/pagespeed";
import { ScoreIcon } from "./ScoreIcon";
import { CategoryBadge } from "./CategoryBadge";

interface AuditItemProps {
  audit: PageSpeedAudit;
}

export const AuditItem = ({ audit }: AuditItemProps) => {
  return (
    <AccordionItem key={audit.id} value={audit.id}>
      <AccordionTrigger className="hover:bg-gray-50">
        <div className="flex items-center gap-3 text-left">
          <ScoreIcon score={audit.score} />
          <div>
            <span className="font-medium">{audit.title}</span>
            {audit.displayValue && (
              <span className="ml-2 text-gray-500 text-sm">
                {audit.displayValue}
              </span>
            )}
          </div>
        </div>
        <CategoryBadge category={audit.category} />
      </AccordionTrigger>
      <AccordionContent>
        <div className="p-3 bg-gray-50 rounded-md">
          <p className="text-sm">{audit.description}</p>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};
