
import { AIReport } from "@/services/aiReportService";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Check } from "lucide-react";

interface StrategySectionProps {
  strategy: AIReport["strategy"];
  title: string;
  icon: React.ReactNode;
  strategyType: "technicalOptimization" | "localSeo" | "contentCreation" | "linkBuilding";
  iconColor: string;
}

export const StrategySection = ({ 
  strategy, 
  title, 
  icon, 
  strategyType, 
  iconColor 
}: StrategySectionProps) => {
  if (!strategy || !strategy[strategyType] || strategy[strategyType]!.length === 0) {
    return null;
  }

  return (
    <AccordionItem value={strategyType}>
      <AccordionTrigger className="text-lg font-medium text-gray-800 hover:text-green-700">
        <div className="flex items-center gap-2">
          {icon}
          {title}
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <ul className="space-y-3 pl-9">
          {strategy[strategyType]!.map((item, idx) => (
            <li key={idx} className="text-gray-700 flex items-start gap-2">
              <Check className={`h-5 w-5 ${iconColor} shrink-0 mt-0.5`} />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </AccordionContent>
    </AccordionItem>
  );
};
